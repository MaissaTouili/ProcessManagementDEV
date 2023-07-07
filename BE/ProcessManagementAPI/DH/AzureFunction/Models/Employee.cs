using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProcessManagementAPI.DH.AzureFunction.Models
{
    public class Employee
    {
        public string EmployeeId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string LineManager { get; set; }
        public string Nationality { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public int PhoneNumber { get; set; }
        public int SecondaryPhoneNumber { get; set; }
        public string PersonalEmail { get; set; }
        public string Linkedin { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string JobTitle { get; set; }
        public List<string> Department { get; set; }

        //public string Department { get; set; }
    }
}
