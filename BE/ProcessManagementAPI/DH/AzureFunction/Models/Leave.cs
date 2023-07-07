using System;
using System.Collections.Generic;
using System.Text;

namespace ProcessManagementAPI.DH.AzureFunction.Models
{
    //class
   public  class Leave
    {
        public string EmployeeName { get; set; }
        public string LeaveType { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public string HalfDay { get; set; }
        public double DaysAllowed{ get; set; }
        public double NumberOfDaysLeave { get; set; }
        public double RemainingLeaves { get; set; }
        public string Reason { get; set; }
        public string Status { get; set; }
    }
}
