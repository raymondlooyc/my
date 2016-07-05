using System;
using System.Data;
using System.Data.OleDb;
using System.IO;

namespace MyApp.Services.DataLoad
{
    public class DataLoadServiceForExcelPre2007 : DataLoadService
    {
        public DataLoadServiceForExcelPre2007(string fileLocation)
        {
            _fileLocation = fileLocation;
        }

        public override DataSet LoadData()
        {
            if (!Path.GetExtension(_fileLocation).ToLower().Equals(".xls"))
                throw new ArgumentException("Class only handles .xls files");

            var xlsConn = new OleDbConnection();
            var data = new DataSet();

            try
            {
                string xlsConnectionString = @"Provider=Microsoft.Jet.OLEDB.4.0;Data " +
                                             "Source=" + _fileLocation + ";Extended Properties=" +
                                             (char) 34 + "Excel 8.0;HDR=NO;IMEX=1;" + (char) 34;

                xlsConn.ConnectionString = xlsConnectionString;
                xlsConn.Open();

                // Get a list of worksheets in the XLS file.
                DataTable sourceFileSchemaTable = xlsConn.GetOleDbSchemaTable(
                    OleDbSchemaGuid.Tables,
                    new object[] {null, null, null, "TABLE"});
             
                foreach (DataRow row in sourceFileSchemaTable.Rows)
                {
                    string sheet = row["Table_Name"].ToString().Replace("''", "'");
                    var xlsAdapter = new OleDbDataAdapter("SELECT * FROM [" + sheet + "]", xlsConn)
                                         {ContinueUpdateOnError = true};
                    xlsAdapter.ContinueUpdateOnError = true;

                    try
                    {
                        var newTable = new DataTable(sheet);
                        xlsAdapter.Fill(newTable);
                        data.Tables.Add(newTable);
                    }
                    catch{}
                }
            }
            finally
            {
                xlsConn.Close();
            }

            return data;
        }
    }
}