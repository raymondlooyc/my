using GPSOAuthSharp;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MyConsoleApp
{
    class Program
    {
        static void Main(string[] args)
        {
            string GOOGLE_LOGIN_ANDROID_ID = "9774d56d682e549c";
            string GOOGLE_LOGIN_SERVICE= "audience:server:client_id:848232511240-7so421jotr2609rmqakceuu1luuq0ptb.apps.googleusercontent.com";
            string GOOGLE_LOGIN_APP = "com.nianticlabs.pokemongo";
            string GOOGLE_LOGIN_CLIENT_SIG = "321187995bc7cdc2b5fc91b11a96e2baa8602c62";

            Console.WriteLine("Google account email: ");
            string email = "marsppherr00@gmail.com";
            Console.WriteLine("Password: ");
            string password = "mr000912";
            GPSOAuthClient client = new GPSOAuthClient(email, password);
            Dictionary<string, string> response = client.PerformMasterLogin();
            string json = JsonConvert.SerializeObject(response, Formatting.Indented);
            Console.WriteLine(json);
            if (response.ContainsKey("Token"))
            {
                string token = response["Token"];
                Dictionary<string, string> oauthResponse = client
                    .PerformOAuth(
                        token,
                        GOOGLE_LOGIN_SERVICE,
                        GOOGLE_LOGIN_APP,
                        GOOGLE_LOGIN_CLIENT_SIG);
                string oauthJson = JsonConvert.SerializeObject(oauthResponse, Formatting.Indented);
                Console.WriteLine(oauthJson);
            }
            else
            {
                Console.WriteLine("MasterLogin failed (check credentials)");
            }
            Console.ReadLine();
        }
    }
}
