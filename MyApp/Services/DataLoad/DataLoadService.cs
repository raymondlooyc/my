using System;
using System.Data;
using System.IO;

namespace MyApp.Services.DataLoad
{
    public class DataLoadService : IDataLoadService
    {
        protected string _fileLocation;

        #region IDataLoadService Members

        DataLoadService IDataLoadService.Create(string fileLocation)
        {
            return Create(fileLocation);
        }

        public virtual DataSet LoadData()
        {
            return null;
        }

        #endregion

        public static DataLoadService Create(string fileLocation)
        {
            switch (Path.GetExtension(fileLocation).ToLower())
            {
                case ".xls":
                    return new DataLoadServiceForExcelPre2007(fileLocation);

                case ".xlsx":
                    return new DataLoadServiceForExcel2007AndAbove(fileLocation);

                case ".csv":
                    return new DataLoadServiceForCSV(fileLocation);

                case ".wk1":
                    return new DataLoadServiceForWK1(fileLocation);

                case ".mdb":
                    return new DataLoadServiceForAccessPre2007(fileLocation);

                case ".accdb":
                    return new DataLoadServiceForAccess2007AndAbove(fileLocation);

                default:
                    throw new ApplicationException("File type not recognised");
            }
        }
    }
}