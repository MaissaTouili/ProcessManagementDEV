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
    public static class GetItemById
    {
        [FunctionName("GetItemById")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "getListItemById/{itemId}")] APIRequestInfo req,
            ILogger log)
        {
            log.LogInformation(string.Format("GetListItemById: List {0} itemId {1}", req.listName, req.itemId));


            var result = await SPHelper.GetListItemsById(req.siteUrl, req.listName, req.itemId, log);

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(result.ToString(), Encoding.UTF8, "application/json")
            };
        }
    }
}
