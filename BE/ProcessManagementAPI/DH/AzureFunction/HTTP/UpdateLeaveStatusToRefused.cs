using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using ProcessManagementAPI.DH.AzureFunction.Models;
using ProcessManagementAPI.DH.AzureFunction.Source;

namespace ProcessManagementAPI.DH.AzureFunction.HTTP
{
    public static class UpdateLeaveStatusToRefused
    {
        [FunctionName("UpdateLeaveStatusToRefused")]
        public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "updateLeaveStatusToRefused")] APIRequestInfo req,
        ILogger log)
        {

            bool success = await SPHelper.UpdateStatusToRefused(req.siteUrl, req.listName, req.itemId, log);

            if (success)
            {
                return new OkResult();
            }
            else
            {
                return new BadRequestResult();
            }
        }
    }
}
