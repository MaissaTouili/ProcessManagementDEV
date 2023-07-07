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
using System.Net;

namespace ProcessManagementAPI.DH.AzureFunction.HTTP
{
    public static class CalculateWorkingHoursDaily
    {
        [FunctionName("CalculateWorkingHoursDaily")]
        public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "calculateWorkingHoursPerDay")] HttpRequest req,
        ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            // Retrieve the employee ID from the request body
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            string employeeId = data?.employeeId;

            if (string.IsNullOrEmpty(employeeId))
            {
                return new BadRequestObjectResult("Please provide an employee ID in the request body.");
            }

            try
            {
                // Call the CalculateWorkingHoursPerDay method
                await SPHelper.CalculateWorkingHoursPerDay(employeeId);

                return new OkResult();
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Error occurred during the calculation of working hours.");
                return new StatusCodeResult((int)HttpStatusCode.InternalServerError);
            }
        }
    }
}
