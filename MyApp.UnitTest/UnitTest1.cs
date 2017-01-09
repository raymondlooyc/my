using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MyApp.Base;

namespace MyApp.UnitTest
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestMethod1()
        {
            string text = "17187@sit.com";

            string value = Base64Encode(text);

            Assert.IsNotNull(value);
        }

        public string Base64Encode(string plainText)
        {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return System.Convert.ToBase64String(plainTextBytes);
        }
    }
}
