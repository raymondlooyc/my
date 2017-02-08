using MyApp.Base;
using MyApp.ViewModel;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Mvc;

namespace MyApp.Areas.RD.Controllers
{
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Callback(string code)
        {
            Dictionary<string, string> queryString = new Dictionary<string, string>();

            foreach (var key in Request.QueryString.AllKeys)
            {
                queryString.Add(key, Request.QueryString[key]);
            }

            string strData = JsonConvert.SerializeObject(queryString);

            return View(new BaseResponse
            { 
                Data = strData 
            });
        }

        public void GetAccessToken(string authorizationCode)
        {
            
            HttpClient _client;
            string baseUrl = "https://login.live.com";

            //string strAuthorization = "Basic " + EncodeBase64(clientId + ":" + clientSecret);

            _client = new HttpClient { BaseAddress = new Uri(baseUrl) };
            _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            string relativeUrl = "/oauth20_token.srf";

            var request = new
            {
                client_id = MyApp.Helper.MS.ApplicationId,
                client_secret = MyApp.Helper.MS.Password,
                redirect_uri = "http://localhost:20000/rd/home/callback",
                code=authorizationCode,
                grant_type="authorization_code"
            };

            var httpResponse = _client.PostAsJsonAsync(relativeUrl, request).Result;

            var obj = httpResponse.Content.ReadAsStringAsync().Result;
        }
    }
}
