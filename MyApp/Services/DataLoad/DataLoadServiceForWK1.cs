using System;
using System.Data;
using System.Data.OleDb;
using System.IO;

namespace MyApp.Services.DataLoad
{
    public class DataLoadServiceForWK1 : DataLoadService
    {
        public DataLoadServiceForWK1(string fileLocation)
        {
            _fileLocation = fileLocation;
        }

        public override DataSet LoadData()
        {
            if (!Path.GetExtension(_fileLocation).ToLower().Equals(".wk1"))
                throw new ArgumentException("Class only handles .wk1 files");

            var data = new DataSet();
            var wk1Conn = new OleDbConnection();
            try
            {
                string wk1ConnectionString = "Provider=Microsoft.Jet.OLEDB.4.0;Data " +
                                             "Source=" + _fileLocation + ";Extended Properties=Lotus WK1;";

                wk1Conn.ConnectionString = wk1ConnectionString;
                wk1Conn.Open();

                string tableName = "[" + Path.GetFileName(_fileLocation) + "]";
                EnsureAllColumnsAreStrings(wk1Conn, tableName, data);

                var wk1Adapter = new OleDbDataAdapter("SELECT * FROM " + tableName, wk1Conn);

                wk1Adapter.ContinueUpdateOnError = true;
                wk1Adapter.Fill(data.Tables[0]);
            }
            finally
            {
                wk1Conn.Close();
            }
            return data;
        }

        private static void EnsureAllColumnsAreStrings(OleDbConnection wk1Conn, string tableName, DataSet data)
        {
            data.Tables.Add(new DataTable());
            var wk1SchemaAdapter = new OleDbDataAdapter("SELECT TOP 1 * FROM " + tableName, wk1Conn);
            var schemaTableSource = new DataTable();
            wk1SchemaAdapter.Fill(schemaTableSource);
            for (int i = 0; i < schemaTableSource.Columns.Count - 1; i++)
                data.Tables[0].Columns.Add(schemaTableSource.Columns[i].ColumnName, Type.GetType("System.String"));
        }
    }
}