using System;
using System.Data;
using System.Data.OleDb;
using System.IO;

namespace MyApp.Services.DataLoad
{
    public class DataLoadServiceForCSV : DataLoadService
    {
        public DataLoadServiceForCSV(string fileLocation)
        {
            _fileLocation = fileLocation;
        }

        public override DataSet LoadData()
        {
            if (!Path.GetExtension(_fileLocation).ToLower().Equals(".csv"))
                throw new ArgumentException("Class only handles .csv files");

            var csvConn = new OleDbConnection();
            var data = new DataSet();

            try
            {
                String csvConnectionString = "Provider=Microsoft.Jet.OLEDB.4.0;Data " +
                         "Source=" + Path.GetDirectoryName(_fileLocation) + ";Extended Properties=Text;";
                
                csvConn.ConnectionString = csvConnectionString;
                csvConn.Open();

                var tableName = "[" + Path.GetFileName(_fileLocation) + "]";
                var csvAdapter = new OleDbDataAdapter("SELECT * FROM " + tableName, csvConn);

                csvAdapter.Fill(data);
            }
            finally
            {
                csvConn.Close();
            }
            return data;
        }
    }
}
