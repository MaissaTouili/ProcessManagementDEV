export const getLeaves = async (): Promise<Leave[]> =>  {
    const listName = "Leaves";
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
      throw new Error("Failed to fetch leave requests.");
    }
  } catch (error) {
    throw new Error("Failed to fetch leave requests.");
  }
   
  };
  
  export const deleteLeave = async (itemId: string): Promise<void> => {
    const listName = 'Leaves';
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
        console.log('Leave request deleted successfully');
      } else {
        throw new Error('Failed to delete a leave request');
      }
    } catch (error) {
      // Handle error while deleting employee
      throw new Error(`Failed to delete a leave request: ${(error as Error).message}`);
    }
  };
  
  export const SendLeaveRequest = async (leaveData: Leave, employeeName: string): Promise<void> => {
    const listName = "Leaves";
    const siteUrl = 'https://datahorizoneu.sharepoint.com/sites/ProcessManagementAppDev';
  
    const dataObjectLeave = { 
      EmployeeName: employeeName,
      LeaveType: leaveData.LeaveType,
      From: leaveData.From,
      To: leaveData.To,
      HalfDay: leaveData.HalfDay,
      NumberOfDaysLeave: leaveData.NumberOfDaysLeave,
      RemainingLeaves: leaveData.RemainingLeaves,
      Reason: leaveData.Reason,
    };
    try {
      const response = await fetch("http://localhost:7071/api/addListLeaveItem", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siteUrl,
          listName,
          dataObjectLeave
        }),
      });
      if (response.ok) {
        // Leave request sent successfully
        console.log('Leave request sent successfully');
      } else {
        throw new Error('Failed to send a leave request');
      }
    } catch (error) {
      // Handle error while sending leave request
      throw new Error(`Failed to send a leave request: ${(error as Error).message}`);
    }
  };
  
  export const getLeavesById = async (itemId: string): Promise<Leave | undefined> =>  {
    const listName = "Leaves";
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
        throw new Error("Failed to fetch leave requests.");
      }
    } catch (error) {
      throw new Error("Failed to fetch leave requests.");
    }
  };

  export const handleApproveLeaveRequest = async (leave: Leave): Promise<void> =>  {
    const listName = "Leaves";
    const siteUrl = "https://datahorizoneu.sharepoint.com/sites/ProcessManagementAppDev";
    const itemId = leave.Id; 
  
    try {
      const response = await fetch(`http://localhost:7071/api/updateLeaveStatusToApproved`, {
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
        console.log('Leave request Approved');
      } else {
        throw new Error('Failed to approve a leave request');
        // Handle the error case when the update fails
      }
    } catch (error) {
      // Handle any network or API request errors
      throw new Error(`Failed to approve a leave request: ${(error as Error).message}`);
    }
  };

  export const handleRefuseLeaveRequest = async (leave: Leave): Promise<void> =>  {
    const listName = "Leaves";
    const siteUrl = "https://datahorizoneu.sharepoint.com/sites/ProcessManagementAppDev";
    const itemId = leave.Id; 
  
    try {
      const response = await fetch(`http://localhost:7071/api/updateLeaveStatusToRefused`, {
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
        console.log('Leave request Refused');
      } else {
        throw new Error('Failed to refuse a leave request');
        // Handle the error case when the update fails
      }
    } catch (error) {
      // Handle any network or API request errors
      throw new Error(`Failed to refuse a leave request: ${(error as Error).message}`);
    }
  };
  export const editLeave = async (leaveData: Leave): Promise<void> => {
    const listName = "Leaves";
    const siteUrl = 'https://datahorizoneu.sharepoint.com/sites/ProcessManagementAppDev';
    const itemId = leaveData.Id;
  
    const dataObjectLeave = { 
      EmployeeName: leaveData.EmployeeName,
      LeaveType: leaveData.LeaveType,
      From: leaveData.From,
      To: leaveData.To,
      HalfDay: leaveData.HalfDay,
      NumberOfDaysLeave: leaveData.NumberOfDaysLeave,
      RemainingLeaves: leaveData.RemainingLeaves,
      Reason: leaveData.Reason,
    };
    try {
      const response = await fetch("http://localhost:7071/api/updateLeaveListItem", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siteUrl,
          listName,
          itemId,
          dataObjectLeave
        }),
      });
      if (response.ok) {
        console.log('Leave request updated successfully');
      } else {
        throw new Error('Failed to update leave request');
      }
    } catch (error) {
      // Handle error while updating employee
      throw new Error(`Failed to update leave request: ${(error as Error).message}`);
    }
  };
  
  
  
  
  
  
  