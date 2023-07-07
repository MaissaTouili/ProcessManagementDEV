using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ProcessManagementAPI.DH.AzureFunction.Models;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using static ProcessManagementAPI.DH.AzureFunction.Models.APIRequestInfo;
using DayOfWeek = Microsoft.Graph.DayOfWeek;
using System.Linq;
using Microsoft.Identity.Client;

namespace ProcessManagementAPI.DH.AzureFunction.Source
{
    class SPHelper
    {
        /// <summary>
        /// Get list items
        /// </summary>
        /// <param name="siteUrl"></param>
        /// <param name="listName"></param>
        /// <param name="filter"></param>
        /// <param name="log"></param>
        /// <returns></returns>
        public static async Task<string> GetListItems(string siteUrl, string listName, string filter, ILogger log)
        {
            try
            {
                var token = await GetAuthTokenForSharePoint();
                //get all teams from api  
                List<object> apiResultList = new List<object>();

                string nextLink = $"{siteUrl}/_api/web/Lists/GetByTitle('{listName}')/items{filter}";

                //get next link resulat
                while (nextLink != null && nextLink != string.Empty)
                {
                    var apiResultGroups = await SPHelper.GetListItemsApi(nextLink, token, siteUrl, log);
                    var apiResultGroupsObject = JsonConvert.DeserializeObject<Rootobject>(apiResultGroups);
                    nextLink = apiResultGroupsObject.odatanextLink;
                    apiResultList.AddRange(apiResultGroupsObject.value);
                }
                var result = JsonConvert.SerializeObject(apiResultList);

                return result;
            }
            catch (Exception ex)
            {
                log.LogError("GetListItems Error {0} {1} {2} {3}", ex.Message, ex.Source, ex.InnerException, ex.StackTrace);

                throw ex;
            }
        }
        /// <summary>
        /// Add new list item
        /// </summary>
        /// <param name="siteUrl"></param>
        /// <param name="listName"></param>
        /// <param name="itemId"></param>
        /// <param name="log"></param>
        /// <returns></returns>
        public static async Task<string> GetListItemsById(string siteUrl, string listName, string itemId, ILogger log)
        {
            try
            {
                var token = await GetAuthTokenForSharePoint();
                List<object> apiResultList = new List<object>();

                string url = $"{siteUrl}/_api/web/Lists/GetByTitle('{listName}')/items({itemId})";
                var apiResult = await SPHelper.GetListItemsApi(url, token, siteUrl, log);
                var apiResultObject = JsonConvert.DeserializeObject<object>(apiResult);
                apiResultList.Add(apiResultObject);

                var result = JsonConvert.SerializeObject(apiResultList);

                return result;
            }
            catch (Exception ex)
            {
                log.LogError("GetListItemsById Error: {0} {1} {2} {3}", ex.Message, ex.Source, ex.InnerException, ex.StackTrace);
                throw ex;
            }
        }



        public static async Task<string> GetListItemsApi(string url, string token, string siteUrl, ILogger log)
        {
            try
            {
                string result = null;

                var digest = await GetDigestForSharePoint(siteUrl, token);

                using (HttpClient client = new HttpClient()
)
                {
                    client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
                    client.DefaultRequestHeaders.Add("accept", "application/json");
                    client.DefaultRequestHeaders.Add("X-RequestDigest", digest);
                    client.DefaultRequestHeaders.Add("X-HTTP-Method", "GET");
                    client.DefaultRequestHeaders.Add("ConsistencyLevel", "eventual");

                    var httpResult = await client.GetAsync(url);

                    if (!httpResult.IsSuccessStatusCode)
                    {
                        log.LogError("Error while get list items: {0}", httpResult.StatusCode.ToString());

                        return String.Empty;
                    }
                    else
                    {
                        if (httpResult.Content != null)
                        {
                            result = await httpResult.Content.ReadAsStringAsync();
                        }
                        return result;

                    }

                }
            }
            catch (Exception ex)
            {
                log.LogError("GetListItems Error {0} {1} {2} {3}", ex.Message, ex.Source, ex.InnerException, ex.StackTrace);

                return String.Empty;
            }
        }

        /// <summary>
        /// Add new list item
        /// </summary>
        /// <param name="siteUrl"></param>
        /// <param name="listName"></param>
        /// <param name=dataObjectEmployee"></param>
        /// <param name="log"></param>
        /// <returns></returns>
        public static async Task<string> AddListItemApi(string siteUrl, string listName, Employee dataObjectEmployee, ILogger log)
        {
            // Get authentication token and digest for SharePoint
            var token = await GetAuthTokenForSharePoint();
            var digest = await GetDigestForSharePoint(siteUrl, token);

            // Construct the SharePoint list item data
            var data = new Dictionary<string, object>
    {
        {"EmployeeId",  dataObjectEmployee.EmployeeId},
        {"FirstName",  dataObjectEmployee.FirstName},
        {"LastName",   dataObjectEmployee.LastName},
        {"LineManager",   dataObjectEmployee.LineManager},
        {"Nationality", dataObjectEmployee.Nationality},
        {"DateOfBirth", dataObjectEmployee.DateOfBirth.ToString("yyyy-MM-ddTHH:mm:ssZ")},
        {"Gender",  dataObjectEmployee.Gender},
        {"PhoneNumber",  dataObjectEmployee.PhoneNumber.ToString()},
        {"SecondaryPhoneNumber",   dataObjectEmployee.SecondaryPhoneNumber.ToString()},
        {"PersonalEmail", dataObjectEmployee.PersonalEmail},
        {"Linkedin",  dataObjectEmployee.Linkedin},
        {"StartDate",  dataObjectEmployee.StartDate.ToString("yyyy-MM-ddTHH:mm:ssZ")},
        {"EndDate", dataObjectEmployee.EndDate.HasValue ? dataObjectEmployee.EndDate.Value.ToString("yyyy-MM-ddTHH:mm:ssZ") : null},
        {"JobTitle", dataObjectEmployee.JobTitle},
        {"Department", dataObjectEmployee.Department.ToArray()},

        // Add other columns as needed
    };

            // Construct the HTTP request to add the list item
            var url = $"{siteUrl}/_api/web/lists/getbytitle('{listName}')/items";
            var requestContent = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
            var request = new HttpRequestMessage(HttpMethod.Post, url);
            request.Headers.Add("Accept", "application/json;odata=verbose");
            request.Headers.Add("Authorization", $"Bearer {token}");
            request.Headers.Add("X-RequestDigest", digest);
            request.Content = requestContent;

            // Send the HTTP request and retrieve the response
            using (var client = new HttpClient())
            {
                var response = await client.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    var errorMessage = await response.Content.ReadAsStringAsync();
                    log.LogError("Error adding list item: {0}", errorMessage);
                    return null;
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                var responseObject = JsonConvert.DeserializeObject<dynamic>(responseContent);
                var newItemId = responseObject.d.ID;

                //log.LogInformation("List item added with ID {0}", newItemId);
                Console.WriteLine("List item added with ID {0}", newItemId);

                return newItemId;
            }
        }


        /// <summary>
        /// Update existing list item
        /// </summary>
        /// <param name="siteUrl"></param>
        /// <param name="listName"></param>
        /// <param name="dataObjectEmployee"></param>
        /// <param name="itemId"></param>
        /// <param name="log"></param>
        /// <returns></returns>
        public static async Task<bool> UpdateListItemApi(string siteUrl, string listName, string itemId, Employee dataObjectEmployee, ILogger log)
        {
            // Get authentication token and digest for SharePoint
            var token = await GetAuthTokenForSharePoint();
            var digest = await GetDigestForSharePoint(siteUrl, token);

            // Construct the SharePoint list item data to update
            var data = new Dictionary<string, object>
    {
        {"EmployeeId",  dataObjectEmployee.EmployeeId},
        {"FirstName",  dataObjectEmployee.FirstName},
        {"LastName",   dataObjectEmployee.LastName},
        {"LineManager",   dataObjectEmployee.LineManager},
        {"Nationality", dataObjectEmployee.Nationality},
        {"DateOfBirth", dataObjectEmployee.DateOfBirth.ToString("yyyy-MM-ddTHH:mm:ssZ")},
        {"Gender",  dataObjectEmployee.Gender},
        {"PhoneNumber",  dataObjectEmployee.PhoneNumber.ToString()},
        {"SecondaryPhoneNumber",   dataObjectEmployee.SecondaryPhoneNumber.ToString()},
        {"PersonalEmail", dataObjectEmployee.PersonalEmail},
        {"Linkedin",  dataObjectEmployee.Linkedin},
        {"StartDate",  dataObjectEmployee.StartDate.ToString("yyyy-MM-ddTHH:mm:ssZ")},
        {"EndDate",  dataObjectEmployee.EndDate.HasValue ? dataObjectEmployee.EndDate.Value.ToString("yyyy-MM-ddTHH:mm:ssZ") : null},
        {"JobTitle", dataObjectEmployee.JobTitle},
        {"Department", dataObjectEmployee.Department.ToArray()},

        // Add other columns as needed
    };

            // Construct the HTTP request to update the list item
            var url = $"{siteUrl}/_api/web/lists/getbytitle('{listName}')/items({itemId})";
            var requestContent = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
            var request = new HttpRequestMessage(HttpMethod.Post, url);
            request.Headers.Add("Accept", "application/json;odata=verbose");
            request.Headers.Add("Authorization", $"Bearer {token}");
            request.Headers.Add("X-RequestDigest", digest);
            request.Headers.Add("X-HTTP-Method", "MERGE");
            request.Headers.Add("IF-MATCH", "*");
            request.Content = requestContent;

            // Send the HTTP request and retrieve the response
            using (var client = new HttpClient())
            {
                var response = await client.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    var errorMessage = await response.Content.ReadAsStringAsync();
                    log.LogError("Error updating list item: {0}", errorMessage);
                    return false;
                }

                log.LogInformation("List item with ID {0} updated successfully", itemId);
                //Console.WriteLine("List item with ID {0} updated successfully", itemId);

                return true;
            }
        }




        /// <summary>
        /// Delete list item
        /// </summary>
        /// <param name="siteUrl"></param>
        /// <param name="listName"></param>
        /// <param name="itemId"></param>
        /// <param name="log"></param>
        /// <returns></returns>
        public static async Task<string> DeleteListItem(string siteUrl, string listName, string itemId, ILogger log)
        {
            try
            {
                var token = await GetAuthTokenForSharePoint();
                var digest = await GetDigestForSharePoint(siteUrl, token);

                HttpClient client = new HttpClient();
                client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
                client.DefaultRequestHeaders.Add("accept", "application/json;odata=verbose");
                client.DefaultRequestHeaders.Add("X-RequestDigest", digest);
                client.DefaultRequestHeaders.Add("IF-MATCH", "*");
                client.DefaultRequestHeaders.Add("X-HTTP-Method", "DELETE");

                using (HttpResponseMessage response = await client.DeleteAsync($"{siteUrl}/_api/web/Lists/GetByTitle('{listName}')/items({itemId})"))
                {
                    if (!response.IsSuccessStatusCode)
                    {
                        log.LogError("Error while delete list item: {0}", response.StatusCode.ToString());
                        return String.Empty;
                    }
                    else
                    {
                        return response.Content.ReadAsStringAsync().Result;
                    }
                }
            }
            catch (Exception ex)
            {
                log.LogError("DeleteListItem Error {0} {1} {2} {3}", ex.Message, ex.Source, ex.InnerException, ex.StackTrace);
                return String.Empty;
            }
        }

        public static async Task CalculateWorkingHoursPerDay(string employeeId)
        {
            // Make a direct REST API call to retrieve the presence information
            var accessToken = await GetAuthTokenForGraphAPI();
            var requestUrl = "https://graph.microsoft.com/v1.0/users/{employeeId}/presence";
            Console.WriteLine(accessToken);
            Console.WriteLine("presence:", requestUrl);
            var httpClient = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Get, requestUrl);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            var response = await httpClient.SendAsync(request);


            var presenceJson = await response.Content.ReadAsStringAsync();

            // Deserialize the presence information from the JSON response
            var presenceCollection = JsonConvert.DeserializeObject<PresenceCollection>(presenceJson);
            var presence = presenceCollection.Value; // Get the list of Presence objects
            // Calculate the working hours based on the presence information
            var workingHoursPerDay = new Dictionary<DayOfWeek, double>();

            // Initialize the working hours dictionary
            foreach (DayOfWeek dayOfWeek in Enum.GetValues(typeof(DayOfWeek)))
            {
                workingHoursPerDay[dayOfWeek] = 0.0;
            }

            DateTime? previousEndTime = null; // Store the end time of the previous presence event

            // Calculate working hours for each presence event
            foreach (var eventObject in presence)
            {
                // Check if the event is within the desired statuses
                if (eventObject.Activity == "Available" || eventObject.Activity == "InAMeeting" || eventObject.Activity == "InAPresentation")
                {
                    // Get the start and end time of the presence event
                    var eventStartTime = eventObject.TimelineStart.ToLocalTime();
                    var eventEndTime = eventObject.TimelineEnd.ToLocalTime();

                    // Calculate the duration of the presence event
                    double eventDuration;
                    if (previousEndTime.HasValue && eventStartTime > previousEndTime)
                    {
                        eventDuration = (eventEndTime - eventStartTime).TotalHours;
                    }
                    else
                    {
                        eventDuration = (eventEndTime - eventStartTime).TotalHours;
                    }

                    // Increment the working hours for the corresponding day
                    var eventDayOfWeek = (Microsoft.Graph.DayOfWeek)eventStartTime.DayOfWeek;
                    workingHoursPerDay[eventDayOfWeek] += eventDuration;

                    // Update the previous end time
                    previousEndTime = eventEndTime;
                }
            }

            // Store the working hours in the SharePoint List
            var siteUrl = "https://datahorizoneu.sharepoint.com/sites/ProcessManagementAppDev";
            var listName = "NumberOfHoursWorkedPerDay";
            await AddHoursWorkedToSharePointList(siteUrl, listName, employeeId, workingHoursPerDay);
        }

        public class EmployeeData
        {
            public string Id { get; set; }
            // Add other properties as needed
        }
        public static async Task AddHoursWorkedToSharePointList(string siteUrl, string listName, string employeeId, Dictionary<DayOfWeek, double> workingHoursPerDay)
        {
            // Get the access token for Microsoft Graph API
            var graphApiToken = await GetAuthTokenForGraphAPI();

            // Fetch the employee information using Microsoft Graph API
            var employeeInfoUrl = $"https://graph.microsoft.com/v1.0/users";
            var httpClient = new HttpClient();
            var employeeRequest = new HttpRequestMessage(HttpMethod.Get, employeeInfoUrl);
            employeeRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", graphApiToken);
            var employeeResponse = await httpClient.SendAsync(employeeRequest);
            var employeeJson = await employeeResponse.Content.ReadAsStringAsync();
            var employeeData = JsonConvert.DeserializeObject<EmployeeData>(employeeJson);

            // Get the access token for SharePoint API
            var sharepointToken = await GetAuthTokenForSharePoint();
            // Get the SharePoint List digest value
            var digest = await GetDigestForSharePoint(siteUrl, sharepointToken);

            // Calculate the start of the week (Monday)
            var currentDate = DateTime.Now;
            var daysUntilMonday = ((int)currentDate.DayOfWeek - (int)DayOfWeek.Monday + 7) % 7;
            var weekStartDate = currentDate.AddDays(-daysUntilMonday).Date;

            // Loop through each week within the month
            while (weekStartDate.Month == currentDate.Month)
            {
                // Create the SharePoint list item payload
                var listItemPayload = new Dictionary<string, object>
             {
                { "__metadata", new { type = "SP.Data.NumberOfHoursWorkedPerDayListItem" } },
                { "EmployeeId", employeeData.Id },
                { "WeekStartDate", weekStartDate },
                { "Month", $"{currentDate.Month}-{currentDate.Year}" }
             };

                // Add the employee's working hours to the payload for each day from Monday to Friday
                for (DayOfWeek dayOfWeek = DayOfWeek.Monday; dayOfWeek <= DayOfWeek.Friday; dayOfWeek++)
                {
                    string columnName = dayOfWeek.ToString();
                    double workingHours = workingHoursPerDay.ContainsKey(dayOfWeek) ? workingHoursPerDay[dayOfWeek] : 0.0;
                    listItemPayload[columnName] = workingHours;
                }

                // Add the SharePoint list item
                var sharepointListUrl = $"{siteUrl}/_api/web/lists/getbytitle('{listName}')/items";
                var sharepointRequest = new HttpRequestMessage(HttpMethod.Post, sharepointListUrl);
                sharepointRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", sharepointToken);
                sharepointRequest.Headers.Add("X-RequestDigest", digest);
                sharepointRequest.Content = new StringContent(JsonConvert.SerializeObject(listItemPayload), Encoding.UTF8, "application/json");
                var sharepointResponse = await httpClient.SendAsync(sharepointRequest);

                if (sharepointResponse.IsSuccessStatusCode)
                {
                    Console.WriteLine("Working hours added to SharePoint list successfully.");
                }
                else
                {
                    Console.WriteLine("Failed to add working hours to SharePoint list.");
                }

                // Move to the next week start date
                weekStartDate = weekStartDate.AddDays(7);
            }
        }

        /// <summary>
        /// Add new list item
        /// </summary>
        /// <param name="siteUrl"></param>
        /// <param name="listName"></param>
        /// <param name=dataObjectLeave"></param>
        /// <param name="log"></param>
        /// <returns></returns>
        public static async Task<string> AddListLeaveItemApi(string siteUrl, string listName, Leave dataObjectLeave, ILogger log)
        {
            // Get authentication token and digest for SharePoint
            var token = await GetAuthTokenForSharePoint();
            var digest = await GetDigestForSharePoint(siteUrl, token);
            // Calculate the number of days leave
                var fromDate = dataObjectLeave.From;
                var toDate = dataObjectLeave.To;
                var numberOfDaysLeave = (toDate - fromDate).TotalDays + 1;
            // Calculate the remaining leaves
            var daysAllowed = 42.0;
                var status = "In Progress";
           
            // Set the default value for HalfDay
            string halfDay = "No";

                // Check if the duration is greater than 1 day
                if (numberOfDaysLeave > 1.0)
                {
                    halfDay = "No";
                }
            else 
            {
                halfDay = dataObjectLeave.HalfDay;

                // Deduct from RemainingLeaves based on HalfDay value
                if ((halfDay == "First Half" || halfDay == "Second Half"))
                {
                    numberOfDaysLeave = 0.5;
                } 
            }
            // Retrieve the remaining leaves from the previous request
            var previousRemainingLeaves = await GetRemainingLeavesFromPreviousRequest(siteUrl, listName, dataObjectLeave.EmployeeName, daysAllowed, numberOfDaysLeave, log);

            // Calculate the remaining leaves based on the previous request
            var remainingLeaves = previousRemainingLeaves - numberOfDaysLeave;


            // Construct the SharePoint list item data
            var data = new Dictionary<string, object>
    {
        {"EmployeeName",  dataObjectLeave.EmployeeName},
        {"LeaveType",  dataObjectLeave.LeaveType},
        {"From",   fromDate},
        {"To", toDate},
        {"HalfDay",halfDay},
        {"DaysAllowed",   daysAllowed},
        {"NumberOfDaysLeave",  numberOfDaysLeave},
        {"RemainingLeaves",   remainingLeaves},
        {"Reason", dataObjectLeave.Reason},
        {"Status", status}

    };

                // Construct the HTTP request to add the list item
                var url = $"{siteUrl}/_api/web/lists/getbytitle('{listName}')/items";
                var requestContent = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
                var request = new HttpRequestMessage(HttpMethod.Post, url);
                request.Headers.Add("Accept", "application/json;odata=verbose");
                request.Headers.Add("Authorization", $"Bearer {token}");
                request.Headers.Add("X-RequestDigest", digest);
                request.Content = requestContent;

                // Send the HTTP request and retrieve the response
                using (var c = new HttpClient())
                {
                    var response = await c.SendAsync(request);

                    if (!response.IsSuccessStatusCode)
                    {
                        var errorMessage = await response.Content.ReadAsStringAsync();
                        log.LogError("Error adding list item: {0}", errorMessage);
                        return null;
                    }

                    var responseContent = await response.Content.ReadAsStringAsync();
                    var responseObject = JsonConvert.DeserializeObject<dynamic>(responseContent);
                    var newItemId = responseObject.d.ID;

                    //log.LogInformation("List item added with ID {0}", newItemId);
                    Console.WriteLine("List item added with ID {0}", newItemId);

                    return newItemId;
                }
            }

        /// <summary>
        /// calculate remaining leaves
        /// </summary>
        /// <param name="siteUrl"></param>
        /// <param name="listName"></param>
        /// <param name="log"></param>
        /// <returns></returns>

        public static async Task<double> GetRemainingLeavesFromPreviousRequest(string siteUrl, string listName, string employeeName, double daysAllowed, double numberOfDaysLeave,ILogger log)
        {

            var token = await GetAuthTokenForSharePoint();
            // SharePoint REST API endpoint to fetch list items
            var apiUrl = $"{siteUrl}/_api/web/lists/getbytitle('{listName}')/items";
            // SharePoint query to filter items based on employee name and order by created date in descending order
            var query = $"$filter=EmployeeName eq '{employeeName}'&$orderby=Created desc";

            // Complete API URL with query parameters
            var apiQueryUrl = $"{apiUrl}?{query}";

            // SharePoint REST API request to fetch list items
            var request = new HttpRequestMessage(HttpMethod.Get, apiQueryUrl);
            request.Headers.Add("Accept", "application/json;odata=verbose");
            request.Headers.Add("Authorization", $"Bearer {token}");
            // Send the HTTP request and retrieve the response
            using (var client = new HttpClient())
            {
                var response = await client.SendAsync(request);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var responseObject = JsonConvert.DeserializeObject<dynamic>(responseContent);

                    // Check if any items are returned in the response
                    if (responseObject.d.results.Count > 0)
                    {
                        // Assuming 'RemainingLeaves' is a field/column in the SharePoint list
                        var previousRemainingLeaves = (double)responseObject.d.results[0].RemainingLeaves;
                        return previousRemainingLeaves;
                    }
                   
                }
                else
                {
                    // Handle the error case when the request is not successful
                    var errorMessage = await response.Content.ReadAsStringAsync();
                    log.LogError("Error retrieving remaining leaves from SharePoint: {0}", errorMessage);
                }
                // No previous leave request found, calculate remaining leaves based on initial values
                var remainingLeaves = daysAllowed;
                return remainingLeaves;
            }
        }

        public static async Task<bool> UpdateStatusToApproved(string siteUrl, string listName, string itemId, ILogger log)
        {
            try
            {
                var token = await GetAuthTokenForSharePoint();
                var digest = await GetDigestForSharePoint(siteUrl, token);

                // Construct the SharePoint list item data to update
                var data = new Dictionary<string, string>
        {
            {"Status", "Approved"} // Set the "Status" field to "Approved"
        };

                // Construct the HTTP request to update the list item
                var url = $"{siteUrl}/_api/web/lists/getbytitle('{listName}')/items({itemId})";
                var requestContent = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
                var request = new HttpRequestMessage(HttpMethod.Post, url);
                request.Headers.Add("Accept", "application/json;odata=verbose");
                request.Headers.Add("Authorization", $"Bearer {token}");
                request.Headers.Add("X-RequestDigest", digest);
                request.Headers.Add("X-HTTP-Method", "MERGE");
                request.Headers.Add("IF-MATCH", "*");
                request.Content = requestContent;

                // Send the HTTP request and retrieve the response
                using (var client = new HttpClient())
                {
                    var response = await client.SendAsync(request);

                    if (!response.IsSuccessStatusCode)
                    {
                        var errorMessage = await response.Content.ReadAsStringAsync();
                        log.LogError("Error updating status to Approved in list item: {0}", errorMessage);
                        return false;
                    }

                    log.LogInformation("List item Status with leave ID {0} updated successfully to Approved", itemId);
                    return true;
                }
            }
            catch (Exception ex)
            {
                log.LogError("UpdateStatusToRefused Error {0} {1} {2} {3}", ex.Message, ex.Source, ex.InnerException, ex.StackTrace);
                return false;
            }
        }

        public static async Task<bool> UpdateStatusToRefused(string siteUrl, string listName, string itemId, ILogger log)
        {
            try
            {
                var token = await GetAuthTokenForSharePoint();
                var digest = await GetDigestForSharePoint(siteUrl, token);

                // Construct the SharePoint list item data to update
                var data = new Dictionary<string, string>
        {
            {"Status", "Refused"} // Set the "Status" field to "Refused"
        };

                // Construct the HTTP request to update the list item
                var url = $"{siteUrl}/_api/web/lists/getbytitle('{listName}')/items({itemId})";
                var requestContent = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
                var request = new HttpRequestMessage(HttpMethod.Post, url);
                request.Headers.Add("Accept", "application/json;odata=verbose");
                request.Headers.Add("Authorization", $"Bearer {token}");
                request.Headers.Add("X-RequestDigest", digest);
                request.Headers.Add("X-HTTP-Method", "MERGE");
                request.Headers.Add("IF-MATCH", "*");
                request.Content = requestContent;

                // Send the HTTP request and retrieve the response
                using (var client = new HttpClient())
                {
                    var response = await client.SendAsync(request);

                    if (!response.IsSuccessStatusCode)
                    {
                        var errorMessage = await response.Content.ReadAsStringAsync();
                        log.LogError("Error updating status to Refused in list item: {0}", errorMessage);
                        return false;
                    }

                    log.LogInformation("List item Status with leave ID {0} updated successfully to Refused", itemId);
                    return true;
                }
            }
            catch (Exception ex)
            {
                log.LogError("UpdateStatusToRefused Error {0} {1} {2} {3}", ex.Message, ex.Source, ex.InnerException, ex.StackTrace);
                return false;
            }
        }

        /// <summary>
        /// Update existing list item
        /// </summary>
        /// <param name="siteUrl"></param>
        /// <param name="listName"></param>
        /// <param name="dataObjectEmployee"></param>
        /// <param name="itemId"></param>
        /// <param name="log"></param>
        /// <returns></returns>
        public static async Task<bool> UpdateLeaveListItemApi(string siteUrl, string listName, string itemId, Leave dataObjectLeave, ILogger log)
        {
            // Get authentication token and digest for SharePoint
            var token = await GetAuthTokenForSharePoint();
            var digest = await GetDigestForSharePoint(siteUrl, token);
            // Calculate the number of days leave
            var fromDate = dataObjectLeave.From;
            var toDate = dataObjectLeave.To;
            var numberOfDaysLeave = (toDate - fromDate).TotalDays + 1;
            // Calculate the remaining leaves
            var daysAllowed = 42.0;
            // Retrieve the remaining leaves from the previous request
            var previousRemainingLeaves = await GetRemainingLeavesFromPreviousRequest(siteUrl, listName, dataObjectLeave.EmployeeName, daysAllowed, numberOfDaysLeave, log);
            var status = "In Progress";
            // Set the default value for HalfDay
            string halfDay = "No";

            // Check if the duration is greater than 1 day
            if (numberOfDaysLeave > 1)
            {
                halfDay = "No";
            }
            else if (numberOfDaysLeave <= 1)
            {
                halfDay = dataObjectLeave.HalfDay;

                // Deduct from RemainingLeaves based on HalfDay value
                if ((halfDay == "First Half" || halfDay == "Second Half"))
                {
                    numberOfDaysLeave = 0.5;
                }
            }
            // Calculate the remaining leaves based on the previous request
            var remainingLeaves = previousRemainingLeaves - numberOfDaysLeave;

            // Construct the SharePoint list item data to update
            var data = new Dictionary<string, object>

    {
        {"EmployeeName",  dataObjectLeave.EmployeeName},
        {"LeaveType",  dataObjectLeave.LeaveType},
        {"From",   fromDate},
        {"To", toDate},
        {"HalfDay",halfDay},
        {"DaysAllowed",   daysAllowed},
        {"NumberOfDaysLeave",  numberOfDaysLeave},
        {"RemainingLeaves",   remainingLeaves},
        {"Reason", dataObjectLeave.Reason},
        {"Status", status}
        // Add other columns as needed
    };

            // Construct the HTTP request to update the list item
            var url = $"{siteUrl}/_api/web/lists/getbytitle('{listName}')/items({itemId})";
            var requestContent = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
            var request = new HttpRequestMessage(HttpMethod.Post, url);
            request.Headers.Add("Accept", "application/json;odata=verbose");
            request.Headers.Add("Authorization", $"Bearer {token}");
            request.Headers.Add("X-RequestDigest", digest);
            request.Headers.Add("X-HTTP-Method", "MERGE");
            request.Headers.Add("IF-MATCH", "*");
            request.Content = requestContent;

            // Send the HTTP request and retrieve the response
            using (var client = new HttpClient())
            {
                var response = await client.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    var errorMessage = await response.Content.ReadAsStringAsync();
                    log.LogError("Error updating list item: {0}", errorMessage);
                    return false;
                }

                log.LogInformation("List item with ID {0} updated successfully", itemId);
                //Console.WriteLine("List item with ID {0} updated successfully", itemId);

                return true;
            }
        }




        /// <summary>
        /// Get authentication token for graphAPI
        /// </summary>
        /// <returns></returns>
        public static async Task<string> GetAuthTokenForGraphAPI()
        {
            string clientId = Constants.GraphApiClientID;
            string clientSecret = Constants.GraphApiClientSecret;
            string tenantId = Constants.GraphApiTenantID;
            string authority = Constants.GraphApiAuthority;

            var app = ConfidentialClientApplicationBuilder
                .Create(clientId)
                .WithClientSecret(clientSecret)
                .WithAuthority(new Uri(authority + tenantId))
                .Build();

            var scopes = new[] { "https://graph.microsoft.com/.default" };

            var result = await app.AcquireTokenForClient(scopes)
                .ExecuteAsync();

            return result.AccessToken;
        }



        /// <summary>
        /// Get authentication token for SharePoint
        /// </summary>
        /// <returns></returns>
        public static async Task<string> GetAuthTokenForSharePoint()
        {
            try
            {
                HttpClient client = new HttpClient();
                string spPrinciple = "00000003-0000-0ff1-ce00-000000000000";
                string spAuthUrl = "https://accounts.accesscontrol.windows.net/" + Constants.TenantID + "/tokens/OAuth/2";

                KeyValuePair<string, string>[] body = new KeyValuePair<string, string>[]
                {
                    new KeyValuePair<string, string>("grant_type", "client_credentials"),
                    new KeyValuePair<string, string>("client_id", $"{Constants.ClientID}@{Constants.TenantID}"),
                    new KeyValuePair<string, string>("resource", $"{spPrinciple}/{Constants.Tenant}@{Constants.TenantID}".Replace("https://", "")),
                    new KeyValuePair<string, string>("client_secret", Constants.ClientSecret)
                };

                var content = new FormUrlEncodedContent(body);
                var contentLength = content.ToString().Length;

                string token = "";

                using (HttpResponseMessage response = await client.PostAsync(spAuthUrl, content))
                {
                    if (response.Content != null)
                    {
                        string responseString = await response.Content.ReadAsStringAsync();
                        JObject data = JObject.Parse(responseString);
                        token = data.Value<string>("access_token");
                    }
                }

                return token;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        /// <summary>
        /// Get digest to connect to SharePoint
        /// </summary>
        /// <param name="siteUrl"></param>
        /// <param name="token"></param>
        /// <returns></returns>
        public static async Task<string> GetDigestForSharePoint(string siteUrl, string token)
        {
            try
            {
                HttpClient client = new HttpClient();

                client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
                client.DefaultRequestHeaders.Add("accept", "application/json;odata=verbose");
                StringContent content = new StringContent("");

                string spTenantUrl = Constants.Tenant;
                string digest = "";

                using (HttpResponseMessage response = await client.PostAsync($"{siteUrl}/_api/contextinfo", content))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        string contentJson = response.Content.ReadAsStringAsync().Result;
                        JObject val = JObject.Parse(contentJson);
                        JToken d = val["d"];
                        JToken wi = d["GetContextWebInformation"];
                        digest = wi.Value<string>("FormDigestValue");
                    }
                }

                return digest;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
    }
}
