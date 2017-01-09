using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MyApp.UnitTest.Service.Common
{
    public class BaseRequest
    {
    }

    public class BaseResponse
    {
        public List<Status> StatusList { get; set; }

        public int StatusCode{ get; set; }

        public string StatusDesc{ get; set; }

        public string ResultCode{ get; set; }

        public string ResultMessage{ get; set; }
    }

    public class Status
    {
        public int StatusCode{ get; set; }

        public string StatusDesc { get; set; }
    }
}
