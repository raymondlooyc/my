using System;
using System.Data;
using System.Data.OleDb;
using System.IO;

namespace MyApp.Services.DataLoad
{
    public class DataLoadServiceForAccessPre2007 : DataLoadService
    {
        public DataLoadServiceForAccessPre2007(string fileLocation)
        {
            _fileLocation = fileLocation;
        }

        public override DataSet LoadData()
        {
            if (!Path.GetExtension(_fileLocation).ToLower().Equals(".mdb"))
                throw new ArgumentException("Class only handles .mdb files");

            var data = new DataSet();
            var accessConnection = new OleDbConnection();
            try
            {
                string wk1ConnectionString = "Provider=Microsoft.Jet.OLEDB.4.0;Data " +
                                             "Source=" + _fileLocation;

                accessConnection.ConnectionString = wk1ConnectionString;
                accessConnection.Open();

                // Get a list of tables in the file
                DataTable sourceFileSchemaTable = accessConnection.GetOleDbSchemaTable(
                    OleDbSchemaGuid.Tables,
                    new object[] { null, null, null, "TABLE" });

                foreach (DataRow row in sourceFileSchemaTable.Rows)
                {
                    var table = row["Table_Name"].ToString().Replace("''", "'");
                    var accessAdapter = new OleDbDataAdapter("SELECT * FROM " + table, accessConnection);
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