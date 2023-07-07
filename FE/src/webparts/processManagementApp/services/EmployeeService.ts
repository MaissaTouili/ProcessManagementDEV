export const getEmployees = async (): Promise<Employee[]> =>  {
  const listName = "Employees";
  const siteUrl = "https://datahorizoneu.sharepoint.com/sites/ProcessManagementAppDev";
  const filter = "";

  try {
  const response = await fetch("http://localhost:7071/api/getListItems", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      listName,
      siteUrl,
      filter
    }),
  });
  if (response.ok) {
    const data = await response.json();
    return data; // Return the fetched employee data
  } else {
    throw new Error("Failed to fetch employees.");
  }
} catch (error) {
  throw new Error("Failed to fetch employees.");
}
 
};

export const deleteEmployee = async (itemId: string): Promise<void> => {
  const listName = 'Employees';
  const siteUrl = 'https://datahorizoneu.sharepoint.com/sites/ProcessManagementAppDev';

  try {
    const response = await fetch(
      `http://localhost:7071/api/deleteListItem/${itemId}`, 
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siteUrl,
          listName,
          itemId,
        }),
      }
    );
  
    if (response.ok) {
      // Employee deleted successfully
      console.log('Employee deleted successfully');
    } else {
      throw new Error('Failed to delete employee');
    }
  } catch (error) {
    // Handle error while deleting employee
    throw new Error(`Failed to delete employee: ${(error as Error).message}`);
  }
};

export const addEmployee = async (employeeData: Employee): Promise<void> => {
  const listName = "Employees";
  const siteUrl = 'https://datahorizoneu.sharepoint.com/sites/ProcessManagementAppDev';

  const dataObjectEmployee = { 
    EmployeeId: employeeData.EmployeeId,
    FirstName: employeeData.FirstName,
    LastName: employeeData.LastName,
    LineManager: employeeData.LineManager,
    Nationality: employeeData.Nationality,
    DateOfBirth: employeeData.DateOfBirth,
    Gender: employeeData.Gender,
    PhoneNumber: employeeData.PhoneNumber,
    SecondaryPhoneNumber: employeeData.SecondaryPhoneNumber,
    PersonalEmail: employeeData.PersonalEmail,
    ProfessionalEmail: employeeData.ProfessionalEmail,
    Linkedin: employeeData.Linkedin,
    StartDate: employeeData.StartDate,
    EndDate: employeeData.EndDate,
    DaysAllowed: employeeData.DaysAllowed,
    EmploymentType: employeeData.EmploymentType,
    JobTitle: employeeData.JobTitle,
    Department: employeeData.Department,
  };
  try {
    const response = await fetch("http://localhost:7071/api/addListItem", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        siteUrl,
        listName,
        dataObjectEmployee
      }),
    });
    if (response.ok) {
      // Employee added successfully
      console.log('Employee added successfully');
    } else {
      throw new Error('Failed to add employee');
    }
  } catch (error) {
    // Handle error while adding employee
    throw new Error(`Failed to add employee: ${(error as Error).message}`);
  }
};

export const editEmployee = async (employeeData: Employee): Promise<void> => {
  const listName = "Employees";
  const siteUrl = 'https://datahorizoneu.sharepoint.com/sites/ProcessManagementAppDev';
  const itemId = employeeData.Id;

  const dataObjectEmployee = { 
    EmployeeId: employeeData.EmployeeId,
    FirstName: employeeData.FirstName,
    LastName: employeeData.LastName,
    LineManager: employeeData.LineManager,
    Nationality: employeeData.Nationality,
    DateOfBirth: employeeData.DateOfBirth,
    Gender: employeeData.Gender,
    PhoneNumber: employeeData.PhoneNumber,
    SecondaryPhoneNumber: employeeData.SecondaryPhoneNumber,
    PersonalEmail: employeeData.PersonalEmail,
    ProfessionalEmail: employeeData.ProfessionalEmail,
    Linkedin: employeeData.Linkedin,
    StartDate: employeeData.StartDate,
    EndDate: employeeData.EndDate,
    DaysAllowed: employeeData.DaysAllowed,
    EmploymentType: employeeData.EmploymentType,
    JobTitle: employeeData.JobTitle,
    Department: employeeData.Department,
  };
  try {
    const response = await fetch("http://localhost:7071/api/updateListItem", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        siteUrl,
        listName,
        itemId,
        dataObjectEmployee
      }),
    });
    if (response.ok) {
      console.log('Employee updated successfully');
    } else {
      throw new Error('Failed to update employee');
    }
  } catch (error) {
    // Handle error while updating employee
    throw new Error(`Failed to update employee: ${(error as Error).message}`);
  }
};

export const getEmployeesById = async (itemId: string): Promise<Employee | undefined> =>  {
  const listName = "Employees";
  const siteUrl = "https://datahorizoneu.sharepoint.com/sites/ProcessManagementAppDev";

  try {
    const response = await fetch(`http://localhost:7071/api/getListItemById/${itemId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        listName,
        siteUrl,
        itemId
      }),
    });
    if (response.ok) {
      const data = await response.json();
      return data.length > 0 ? data[0] : null;
    } else {
      throw new Error("Failed to fetch employees.");
    }
  } catch (error) {
    throw new Error("Failed to fetch employees.");
  }
};




