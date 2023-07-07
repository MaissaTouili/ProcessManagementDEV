using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using ProcessManagementAPI.DH.AzureFunction.Models;
using ProcessManagementAPI.DH.AzureFunction.Source;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace ProcessManagementAPI.DH.AzureFunction.HTTP
{
    public static class GetListItems
    {
        [FunctionName("GetListItems")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Function,
            "post", Route = "getListItems")] APIRequestInfo req, ILogger log)
        {
            log.LogInformation(string.Format("GetListItems: List {0} filter {1}", req.listName, req.filter));


            var result = await SPHelper.GetListItems(req.siteUrl, req.listName, req.filter, log);

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(result.ToString(), Encoding.UTF8, "application/json")
            };


        }
    }
}
