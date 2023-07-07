using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using ProcessManagementAPI.DH.AzureFunction.Source;
using ProcessManagementAPI.DH.AzureFunction.Models;

namespace ProcessManagementAPI.DH.AzureFunction.HTTP
{
    public static class UpdateLeaveStatusToApproved
    {
        [FunctionName("UpdateLeaveStatusToApproved")]
        public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "updateLeaveStatusToApproved")] APIRequestInfo req,
        ILogger log)
        {

            bool success = await SPHelper.UpdateStatusToApproved(req.siteUrl, req.listName, req.itemId, log);

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
