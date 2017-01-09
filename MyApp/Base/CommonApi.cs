using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyApp.Base
{
    public class CommonApi
    {
        public static double ToTimestamp(DateTime datetime)
        {
            DateTime origin = new DateTime(1970, 1, 1, 0, 0, 0, 0);
            TimeSpan diff = datetime.ToUniversalTime() - origin;
            return Math.Floor(diff.TotalSeconds);
        }
    }
}