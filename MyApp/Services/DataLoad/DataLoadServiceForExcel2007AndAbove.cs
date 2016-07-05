using System;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;

namespace MyApp.Services.DataLoad
{
    public class DataLoadServiceForExcel2007AndAbove : DataLoadService
    {
        public DataLoadServiceForExcel2007AndAbove(string fileLocation)
        {
            _fileLocation = fileLocation;
        }

        public override DataSet LoadData()
        {
            if (!Path.GetExtension(_fileLocation).ToLower().Equals(".xlsx"))
                throw new ArgumentException("Class only handles .xlsx files");

            var xlsConn = new OleDbConnection();
            var data = new DataSet();

            using (var pck = new OfficeOpenXml.ExcelPackage())
            {
                using (var stream = File.OpenRead(_fileLocation))
                {
                    pck.Load(stream);
                }

                foreach (var ws in pck.Workbook.Worksheets)
                {
                    DataTable tbl = new DataTable();
                    if (ws.Dimension != null)
                    {
                        for (int i = 0; i < ws.Dimension.End.Column; i++)
                        {
                            tbl.Columns.Add("F" + (i + 1));
                        }

                        for (var rowNum = ws.Dimension.Start.Row; rowNum <= ws.Dimension.End.Row; rowNum++)
                        {
                            var wsRow = ws.Cells[rowNum, 1, rowNum, ws.Dimension.End.Column];
                            var row = tbl.NewRow();
                            foreach (var cell in wsRow)
                            {
                                row[cell.Start.Column - 1] = cell.Text;
                            }
                            tbl.Rows.Add(row);
                        }
                    }
                    else
                    {
                        int endColumn = 1;
                        int startRow = 1;
                        int endRow = 1;

                        for (int i = 0; i <endColumn; i++)
                        {
                            tbl.Columns.Add("F" + (i + 1));
                        }

                        for (var rowNum = startRow; rowNum <= endRow; rowNum++)
                        {
                            var wsRow = ws.Cells[rowNum, 1, rowNum, endColumn];
                            var row = tbl.NewRow();
                            foreach (var cell in wsRow)
                            {
                                row[cell.Start.Column - 1] = cell.Text;
                            }
                            tbl.Rows.Add(row);
                        }
                    }

                    tbl.TableName = "'"+ws.Name+"$'";
                    data.Tables.Add(tbl);
                }
            }

            //try
            //{
            //    var xlsConnectionString = @"Provider=Microsoft.ACE.OLEDB.12.0;Data " +
            //                  "Source=" + _fileLocation + ";Extended Properties=" + (char)34 + "Excel 12.0;HDR=NO;" + (char)34;

            //    xlsConn.ConnectionString = xlsConnectionString;
            //    xlsConn.Open();

            //    // Get a list of worksheets in the XLS file.
            //    DataTable sourceFileSchemaTable = xlsConn.GetOleDbSchemaTable(
            //        OleDbSchemaGuid.Tables,
            //        new object[] { null, null, null, "TABLE" });

            //    foreach (DataRow row in sourceFileSchemaTable.Rows)
            //    {
            //        string sheet = row["Table_Name"].ToString().Replace("''", "'");
            //        var xlsAdapter = new OleDbDataAdapter("SELECT * FROM [" + sheet + "]", xlsConn) { ContinueUpdateOnError = true };
            //        try
            //        {
            //            var newTable = new DataTable(sheet);
            //            xlsAdapter.Fill(newTable);
            //            data.Tables.Add(newTable);
            //        }
            //        catch { }
            //    }
            //}
            //finally
            //{
            //    xlsConn.Close();
            //}

            return data;
        }
    }
}