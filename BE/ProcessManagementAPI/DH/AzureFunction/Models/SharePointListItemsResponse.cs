using System;
using System.Collections.Generic;
using System.Text;

namespace ProcessManagementAPI.DH.AzureFunction.Models
{
    public class SharePointListItemsResponse
    {
        public List<NumberOfHoursWorked> Value { get; set; }
    }

    public class NumberOfHoursWorked
    {
        public string Id { get; set; }
        public string EmployeeId { get; set; }
        public Dictionary<string, string> Fields { get; set; }
    }
}
