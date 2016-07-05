using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MyApp.Controllers
{
    public class SqlServerController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }


        public DataSet GetDataImport_ImportNewItems
       (
           bool SenderDebugYN
       )
        {
            DataSet dsResult = null;
            string SQLCMD = "";
            if (SenderDebugYN == true)
            {
                SQLCMD = "SHAPE {exec spGetImportedReceiptData} APPEND ({exec spGetInitialItemConditions} AS ItemInitialConditions RELATE ItemInitialDataID TO ItemInitialDataID)";
            }
            else
            {
                SQLCMD = "SHAPE {exec spGetImportedSentData} APPEND ({exec spGetInitialActualPostingMethods} AS ItemActualPostingMethods RELATE ItemID TO ItemID)";
            }

            Database db = GetConsigniaSurveysDatabaseShape();
            DbCommand selectCommand = db.GetSqlStringCommand(SQLCMD);

            dsResult = db.ExecuteDataSet(selectCommand);
            return dsResult;
        }

        /// <summary>
        /// Return Security database adapter  that communicate with physical database.
        /// </summary>
        /// <returns>Database adapter</returns>
        public Database GetConsigniaSurveysDatabaseShape()
        {
            return DatabaseFactory.CreateDatabase("ConsigniaSurveysDatabaseShape");
        }
    }
}
