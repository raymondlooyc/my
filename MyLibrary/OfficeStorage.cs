using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace MyLibrary
{
    public class OfficeStorage
    {
        private string _filePath = "";
        private string _fileName = "";

        public OfficeStorage()
        {
            _filePath = @"C:\Temp\";
            _fileName = "data.json";
        }

        private string _path
        {
            get
            {
                return _filePath + _fileName;
            }
        }

        public void AddData(string key, object data)
        {
            if (!Directory.Exists(_filePath))
            {
                DirectoryInfo di = Directory.CreateDirectory(_filePath);
            }

            using (StreamWriter sw = (File.Exists(_path)) ? File.AppendText(_path) : File.CreateText(_path))
            {
                var dataSource = new 
            } 
        }

        public void RemoveData(string key)
        {

        }

        public object GetData(string key)
        {

        }

        public object GetData()
        {
            Dictionary<string, object> data = null;

            string strData = System.IO.File.ReadAllText(_path);

            if(string.IsNullOrEmpty(strData)){
                data = JsonConvert.DeserializeObject<Dictionary<string, object>>(strData);
            }

            return data;
        }
    }
}
