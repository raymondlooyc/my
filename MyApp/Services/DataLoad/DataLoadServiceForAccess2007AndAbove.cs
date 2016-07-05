using System;
using System.Data;
using System.Data.OleDb;
using System.IO;

namespace MyApp.Services.DataLoad
{
    public class DataLoadServiceForAccess2007AndAbove : DataLoadService
    {
        public DataLoadServiceForAccess2007AndAbove(string fileLocation)
        {
            _fileLocation = fileLocation;
        }

        public override DataSet LoadData()
        {
            if (!Path.GetExtension(_fileLocation).ToLower().Equals(".accdb"))
                throw new ArgumentException("Class only handles .accdb files");

            var accessConnection = new OleDbConnection();
            var data = new DataSet();

            try
            {

                var access2007ConnectionString = @"Provider=Microsoft.ACE.OLEDB.12.0;Data " +
                                          "Source=" + _fileLocation;

                accessConnection.ConnectionString = access2007ConnectionString;
                accessConnection.Open();

                // Get a list of tables
                DataTable sourceFileSchemaTable = accessConnection.GetOleDbSchemaTable(
                    OleDbSchemaGuid.Tables,
                    new object[] {null, null, null, "TABLE"});

                foreach (DataRow row in sourceFileSchemaTable.Rows)
                {
                    string table = row["Table_Name"].ToString().Replace("''", "'");
                    var accessAdapter = new OleDbDataAdapter("SELECT * FROM [" + table + "]", accessConnection);
                    accessAdapter.ContinueUpdateOnError = true;

                    try
                    {
                        var newTable = new DataTable(table);
                        accessAdapter.Fill(newTable);
                        data.Tables.Add(newTable);
                    }
                    catch { }
                }
            }
            finally
            {
                accessConnection.Close();
            }

            return data;
        }
    }
}