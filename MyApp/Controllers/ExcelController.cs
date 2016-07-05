using MyApp.Base;
using OfficeOpenXml;
using OfficeOpenXml.Table;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MyApp.Controllers
{
    public class ExcelController : BaseController
    {
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult UploadExcelTable(HttpPostedFileBase excel)
        {
            byte[] myByteArray = new byte[10];

            BinaryReader b = new BinaryReader(excel.InputStream);
            byte[] binData = b.ReadBytes((int)excel.InputStream.Length);

            MemoryStream stream = new MemoryStream();
            stream.Write(binData, 0, binData.Length);

            DataSet dsTables = LoadTableFromXLSXFile(stream);

            foreach (DataTable dtData in dsTables.Tables)
            {
                BulkInsertData(dtData.TableName, dtData);
            }

            return View("Index");
        }

        private DataSet LoadTableFromXLSXFile(System.IO.MemoryStream fileStream)
        {
            var data = new DataSet();

            using (var pck = new OfficeOpenXml.ExcelPackage())
            {
                pck.Load(fileStream);

                foreach (var ws in pck.Workbook.Worksheets)
                {
                    

                    foreach (ExcelTable tbExcel in ws.Tables)
                    {
                        DataTable tbl = new DataTable();
                        if (tbExcel.Address != null)
                        {
                            ExcelAddressBase dataAdress = tbExcel.Address;

                            for (int i = 0; i < dataAdress.End.Column; i++)
                            {
                                
                            }

                            for (var rowNum = dataAdress.Start.Row; rowNum <= dataAdress.End.Row; rowNum++)
                            {
                                var wsRow = ws.Cells[rowNum, 1, rowNum, dataAdress.End.Column];

                                if (rowNum == dataAdress.Start.Row)
                                {
                                    foreach (var cell in wsRow)
                                    {
                                        tbl.Columns.Add(cell.Text);
                                    }
                                }
                                else
                                {
                                    var row = tbl.NewRow();
                                    foreach (var cell in wsRow)
                                    {
                                        row[cell.Start.Column - 1] = cell.Text;
                                    }

                                    tbl.Rows.Add(row);
                                }
                            }
                        }

                        tbl.TableName = tbExcel.Name;
                        data.Tables.Add(tbl);
                    }
                }
            }

            return data;
        }

        public void BulkInsertData(String name, DataTable dtExcelCopy)
        {
            DataTable dtColumnName = new DataTable();
            dtColumnName.Columns.Add("ColumnIndex");
            dtColumnName.Columns.Add("ColumnName");

            int i = 0;

            foreach (DataColumn dc in dtExcelCopy.Columns)
            {
                dtColumnName.Rows.Add(new object[] { i.ToString(), dc.ColumnName });

                i = i + 1;
            }

            SqlConnection conn = new SqlConnection(GetRayDBConn());

            //create temp table
            var sqlCommand = new SqlCommand("CreateTable", conn);
            sqlCommand.CommandTimeout = 0;
            sqlCommand.CommandType = CommandType.StoredProcedure;

            sqlCommand.Parameters.Add(new SqlParameter("@TableName", name));
            SqlParameter categoryList = sqlCommand.Parameters.AddWithValue("@DataColumn", dtColumnName);

            categoryList.SqlDbType = SqlDbType.Structured;

            var dataSet = new DataSet();
            var adapter = new SqlDataAdapter(sqlCommand);

            adapter.Fill(dataSet);

            if(conn.State == ConnectionState.Closed)
            {
                conn.Open();
            }

            //bulk insert data
            using (SqlBulkCopy bulkcopy = new SqlBulkCopy(conn))
            {
                bulkcopy.DestinationTableName = name;
                bulkcopy.BulkCopyTimeout = 300;
                bulkcopy.WriteToServer(dtExcelCopy);
            }
        }
    }
}
