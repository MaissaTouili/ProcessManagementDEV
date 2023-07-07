import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../store/reducers/RootReducer';
//import { deleteLeaveFailure, deleteLeaveSuccess, getLeavesFailure, getLeavesRequest, getLeavesSuccess } from '../../store/actions/actions';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
//import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PageHeader from '../pageheader/Pageheader';
import ViewListIcon from '@mui/icons-material/ViewList';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import { Alert, Button, CircularProgress, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, IconButton, Paper, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import { getLeaves, deleteLeave, handleApproveLeaveRequest, handleRefuseLeaveRequest } from '../../services/LeaveService';
import { getLeavesRequest, getLeavesSuccess, getLeavesFailure, deleteLeaveSuccess, deleteLeaveFailure } from '../../store/actions/actions';
import EditIcon from '@mui/icons-material/Edit';
import AlertIcon from '@mui/icons-material/ErrorOutlineOutlined';

interface ILeavesListProps extends RouteComponentProps {
    leaves: Leave[];
    fetchLeaves: () => void;
    deleteLeave: (itemId: string) => void;
    user: SharePointUser;
    employees: Employee[];
}

interface DispatchProps {
    fetchLeaves: () => void;
    deleteLeave: (Id: string) => void;
  }

interface StateProps {
    leaves: Leave[];
  }

interface ILeavesListState {
    page: number;
    rowsPerPage: number;
    displayCards: boolean;
    expandedLeaveId: number | undefined;
    filteredLeaves: Leave[];
    showErrorMessage: boolean;
    showDialog: boolean, // Indicates whether the custom dialog should be displayed
    deleteItemId: number,
    selectedStatus: string;
    isAllLeavesManager: boolean;
}

interface Column {
    id: keyof Leave;
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    { id: 'EmployeeName', label: 'Employee Name', minWidth: 160 },
    { id: 'LeaveType', label: 'Leave Type', minWidth: 160 },
    { id: 'From', label: 'From', minWidth: 160 },
    { id: 'To', label: 'To', minWidth: 160 },
    { id: 'HalfDay', label: 'Half Day', minWidth: 160 },
    { id: 'NumberOfDaysLeave', label: 'Number Of Days Leave', minWidth: 160 },
    { id: 'RemainingLeaves', label: 'Remaining Leaves', minWidth: 160 },
    { id: 'Reason', label: 'Reason', minWidth: 160 },
    { id: 'Status', label: 'Status', minWidth: 160 },
];


class LeavesList extends React.Component<ILeavesListProps, ILeavesListState> {

    constructor(props: ILeavesListProps) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 5,
            displayCards: false,
            expandedLeaveId: null,
            filteredLeaves: this.props.leaves.filter(
                (leave: Leave) => leave.Status === 'In Progress'
            ),
            showErrorMessage: false,
            showDialog: false, // Indicates whether the custom dialog should be displayed
            deleteItemId: null,
            selectedStatus: '',
            isAllLeavesManager: false,
        };
        this.handleStatusChangeForEmployee = this.handleStatusChangeForEmployee.bind(this);
        this.handleStatusChangeForAllEmployees = this.handleStatusChangeForAllEmployees.bind(this);
        this.handleStatusChangeForManager = this.handleStatusChangeForManager.bind(this);
        this.handleStatusChangeForManagerLeaves = this. handleStatusChangeForManagerLeaves.bind(this);
    }

    handleChangePage = (event: unknown, newPage: number): void => {
        this.setState({ page: newPage });
    };

    handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            rowsPerPage: +event.target.value,
            page: 0
        });
    };
    public componentDidMount(): void {
        this.props.fetchLeaves();
        this.updateIsAllLeavesManager(this.props.location.pathname);
    }
    componentDidUpdate(prevProps: ILeavesListProps): void {
        if (this.props.location.pathname !== prevProps.location.pathname) {
          this.updateIsAllLeavesManager(this.props.location.pathname);
        }
      }
    
    updateIsAllLeavesManager(pathname: string): void {
        const isAllLeavesManager = pathname === '/leaves/leavesOfManager';
        this.setState({
          isAllLeavesManager: isAllLeavesManager,
        });
      }

    openDialog = (itemId: number): void => {
        this.setState({
            showDialog: true,
            deleteItemId: itemId,
        });
    };
    closeDialog = (): void => {
        this.setState({
            showDialog: false,
            deleteItemId: null,
        });
    };
    private handleDeleteLeave = (Id: number): void => {
        this.openDialog(Id);
    };
    handleDeleteConfirmed = (): void => {
        const itemId = this.state.deleteItemId.toString();

        try {
            this.props.deleteLeave(itemId); // Delete the leave request
            this.props.fetchLeaves(); // Fetch updated leave request list
            this.closeDialog(); // Close the custom dialog
        } catch (error) {
            console.error('Failed to delete a Leave Request:', error);
        }
    };

    handleStatusChangeForEmployee(event: React.ChangeEvent<HTMLInputElement>): void {
        const { leaves, user } = this.props;
        const selectedStatus = event.target.value;

        let filteredLeaves;
        if (selectedStatus === '') {
            filteredLeaves = leaves.filter((leave: Leave) => leave.EmployeeName === user.Title); // Display all leaves when the checkbox is unchecked
        } else {
            filteredLeaves = leaves.filter((leave: Leave) => leave.Status === selectedStatus && leave.EmployeeName === user.Title);
        }

        this.setState({ selectedStatus, filteredLeaves });
    }

    handleStatusChangeForAllEmployees(event: React.ChangeEvent<HTMLInputElement>): void {
        const { leaves } = this.props;
        const selectedStatus = event.target.value;

        let filteredLeaves;
        if (selectedStatus === '') {
            filteredLeaves = leaves;
        } else {
            filteredLeaves = leaves.filter((leave: Leave) => leave.Status === selectedStatus);
        }

        this.setState({ selectedStatus, filteredLeaves });
    }
    handleStatusChangeForManager(event: React.ChangeEvent<HTMLInputElement>): void {
        const { leaves, user, employees } = this.props;
        const selectedStatus = event.target.value;
    
        let filteredLeaves;
        if (selectedStatus === '') {

            filteredLeaves = leaves.filter((leave: Leave) => {
                const listEmployees = employees.filter((employee) => user.Title === employee.LineManager && employee.JobTitle !== "Manager");
               // leave.EmployeeName != user.Title;
                return listEmployees && leave.EmployeeName !== user.Title;
            });
           
        } else {
            filteredLeaves = leaves.filter((leave: Leave) => {
                const listEmployees = employees.filter((employee) => user.Title === employee.LineManager && employee.JobTitle !== "Manager");
                //leave.EmployeeName != user.Title;
                return listEmployees && leave.Status === selectedStatus && leave.EmployeeName !== user.Title;
            });
        }
    
        this.setState({ selectedStatus, filteredLeaves });
    }
    handleStatusChangeForManagerLeaves(event: React.ChangeEvent<HTMLInputElement>): void {
        const { leaves, user, employees } = this.props;
        const selectedStatus = event.target.value;
    
        let filteredLeaves;
        if (selectedStatus === '') {

            filteredLeaves = leaves.filter((leave: Leave) => {
                const listEmployees = employees.filter((employee) => employee.JobTitle === "Manager");
                return listEmployees && leave.EmployeeName === user.Title;
            });
           
        } else {
            filteredLeaves = leaves.filter((leave: Leave) => {
                const listEmployees = employees.filter((employee) => employee.JobTitle === "Manager");
                return listEmployees && leave.Status === selectedStatus && leave.EmployeeName === user.Title;
            });
        }
        this.setState({ selectedStatus, filteredLeaves });
    }



    private handleAddLeaveRequest = (): void  => {
        const { leaves, user } = this.props; // Assuming you have an array of leaves in props

        // Check if any leave request has a status of "In Progress"
        const hasInProgressLeave = leaves.some((leave: Leave) => leave.Status === 'In Progress' && leave.EmployeeName === user.Title);

        if (hasInProgressLeave) {
            // Display a notification indicating that a leave request is already in progress
            this.setState({ showErrorMessage: true });
            setTimeout(() => {
                this.setState({ showErrorMessage: false });
            }, 7000);
        } else {

            // Navigate to the "/leaves/leaveRequest" route
            this.props.history.push('/leaves/SendLeaveRequest');
        }
    }
    handleCloseErrorMessage = (): void => {
        this.setState({ showErrorMessage: false });
    }

    handleGoBack = (): void => {
        const { history } = this.props;
        history.goBack();
    };

    private formatDate = (date: string): string => {
        try {
          const formattedDate = new Date(date);
          if (isNaN(formattedDate.getTime())) {
            throw new Error('Invalid date');
          }
          return formattedDate.toISOString().split('T')[0];
        } catch (error) {
          console.error('Error formatting date:', error);
          return 'Invalid date';
        }
      };

    handleApprove = async (event: React.MouseEvent<HTMLButtonElement>, leave: Leave): Promise<void> => {
        event.preventDefault();
        try {
            await handleApproveLeaveRequest(leave);
            this.props.fetchLeaves();
            const updatedFilteredLeaves = this.state.filteredLeaves.filter(
                (filteredLeave) => filteredLeave.Id !== leave.Id
            );
            this.setState({
                filteredLeaves: updatedFilteredLeaves,
            });
        } catch (error) {
            // Handle the error case when the update fails
            console.error('Failed to approve a Leave Request:', error);
        }
    };

    handleRefuse = async (event: React.MouseEvent<HTMLButtonElement>, leave: Leave): Promise<void> => {
        event.preventDefault();
        try {
            await handleRefuseLeaveRequest(leave);
            await this.props.fetchLeaves();
            const updatedFilteredLeaves = this.state.filteredLeaves.filter(
                (filteredLeave) => filteredLeave.Id !== leave.Id
            );
            this.setState({
                filteredLeaves: updatedFilteredLeaves,
            });
        } catch (error) {
            console.error('Failed to approve a Leave Request:', error);
        }
    };
    private handleUpdateLeaveRequest = (Id: number): void => {
        this.props.history.push(`/leaves/UpdateLeaveRequest/${Id}`);
    };

    public render(): JSX.Element {
        const { employees, leaves, user } = this.props;
        const { page, rowsPerPage, showErrorMessage, selectedStatus, filteredLeaves,isAllLeavesManager } = this.state;
        const totalCount = leaves.length;

        const filteredLeavesViaEmployee = leaves.filter((leave: Leave) => {
            return leave.EmployeeName === user.Title;
        });
        const filteredLeavesViaLineManager = leaves.filter((leave: Leave) => {
            const correspondingEmployees = employees.filter((employee) => {
              return employee.LineManager === user.Title && employee.JobTitle !== "Manager";
            });
            
            return correspondingEmployees && leave.EmployeeName !== user.Title;
          });

        const filteredLeavesOfManager=  leaves.filter((leave: Leave) => {
            const correspondingEmployees = employees.filter((employee) => {
              return  employee.JobTitle === "Manager";
            });
            
            return correspondingEmployees && leave.EmployeeName === user.Title;
          });

        const emptyRows =
            rowsPerPage - Math.min(rowsPerPage, totalCount - page * rowsPerPage);

        return (
            <div>
                <ArrowBackOutlinedIcon onClick={this.handleGoBack} sx={{ color: "rgb(139, 161, 183)" }} />
                <Collapse in={showErrorMessage} timeout={500} mountOnEnter unmountOnExit>
                    <Alert severity="error" variant="outlined" icon={<AlertIcon />} style={{
                        transform: showErrorMessage ? 'translateX(0)' : 'translateX(100%)',
                        transition: 'transform 0.3s ease-in-out'
                    }}>
                        Forbidden: You won't be able to send a leave request until the previous one is processed!
                    </Alert>
                </Collapse>
                <Dialog
                    open={this.state.showDialog}
                    onClose={this.closeDialog}
                    aria-labelledby="delete-dialog-title"
                    aria-describedby="delete-dialog-description"
                >
                    <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="delete-dialog-description">
                            Are you sure you want to delete this Leave Request?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeDialog} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => this.handleDeleteConfirmed()} color="primary" autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
                {user && (
                    <>
                        { user.IsSiteAdmin && !employees.some((employee) => employee.JobTitle === "Manager" && user.Title === `${employee.FirstName} ${employee.LastName}`) && (// only Admin
                            <PageHeader
                                key="admin-header"
                                title="Leave Requests"
                                subTitle="List of all the leave requests for all the employees"
                                icon={<ViewListIcon fontSize="large" style={{ color: "rgb(11, 41, 72)" }} />}
                            />
                        )}
                        {employees.map((employee) => { //Manager
                            if (employee.JobTitle === "Manager" && user.Title === `${employee.FirstName} ${employee.LastName}`) {
                                if (isAllLeavesManager) {
                                    // Render for all leaves
                                    return (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                                        <PageHeader
                                            key="manager-header"
                                            title="Leave Requests"
                                            subTitle={`Welcome manager ${user.Title}, Here is the list of all your leave requests!`}
                                            icon={<ViewListIcon fontSize="large" style={{ color: "rgb(11, 41, 72)" }} />}
                                        />
                                        <Button variant="contained" size="small" onClick={this.handleAddLeaveRequest} style={{ color: "rgb(139, 161, 183)", backgroundColor: "rgb(11, 41, 72)", marginLeft: "10px" }}
                                            endIcon={<AddCircleOutlineIcon style={{ color: "rgb(89, 208, 255)" }} />} >  Add </Button>
                                    </div>
                                    );
                                  } else {
                                return (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                                        <PageHeader
                                            key="manager-header"
                                            title="Leave Requests"
                                            subTitle={`Welcome manager ${user.Title}, Here is the list of all the leave requests of the employees you're managing!`}
                                            icon={<ViewListIcon fontSize="large" style={{ color: "rgb(11, 41, 72)" }} />}
                                        />
                                        <Button variant="contained" size="small" onClick={this.handleAddLeaveRequest} style={{ color: "rgb(139, 161, 183)", backgroundColor: "rgb(11, 41, 72)", marginLeft: "10px" }}
                                            endIcon={<AddCircleOutlineIcon style={{ color: "rgb(89, 208, 255)" }} />} >  Add </Button>
                                    </div>
                                );}
                            }
                        })}

                        {!user.IsSiteAdmin && !employees.some((employee) => employee.JobTitle === "Manager" && user.Title === `${employee.FirstName} ${employee.LastName}`) && (//only Employee
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                                <PageHeader
                                    key="employee-header"
                                    title="Leave Requests"
                                    subTitle={`Welcome ${user.Title}, Here is the list of all your leave requests!`}
                                    icon={<ViewListIcon fontSize="large" style={{ color: "rgb(11, 41, 72)" }} />}
                                />
                                <Button variant="contained" size="small" onClick={this.handleAddLeaveRequest} style={{ color: "rgb(139, 161, 183)", backgroundColor: "rgb(11, 41, 72)", marginLeft: "10px" }}
                                    endIcon={<AddCircleOutlineIcon style={{ color: "rgb(89, 208, 255)" }} />} >  Add </Button>
                            </div>
                        )}
                    </>
                )}

                {leaves.length === 0 ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                        <CircularProgress sx={{ color: "rgb(89, 208, 255)" }} />
                    </div>
                ) : (
                    <div>
                        {user && (
                            <>
                                {user.IsSiteAdmin && (!employees.some((employee) => employee.JobTitle === "Manager" && user.Title === `${employee.FirstName} ${employee.LastName}`)) && (// only Admin
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                                            <FormControl>
                                                <RadioGroup
                                                    row
                                                    name="row-radio-buttons-group"
                                                    value={this.state.selectedStatus} // Set the selectedStatus from component state
                                                    onChange={this.handleStatusChangeForAllEmployees} // Update the method name
                                                >
                                                    <FormControlLabel value="" control={<Radio size="small" />} label="All" />
                                                    <FormControlLabel value="In Progress" style={{ marginLeft: "10px" }} control={<Radio size="small" />} label="In Progress" />
                                                    <FormControlLabel value="Approved" style={{ marginLeft: "10px" }} control={<Radio size="small" />} label="Approved" />
                                                    <FormControlLabel value="Refused" style={{ marginLeft: "10px" }} control={<Radio size="small" />} label="Refused" />
                                                </RadioGroup>
                                            </FormControl>
                                        </div>
                                        <div>
                                            <Paper sx={{ maxWidth: '100%', overflow: 'hidden' }}>
                                                <TableContainer sx={{ maxHeight: 300 }}>
                                                    <Table stickyHeader aria-label="sticky table">
                                                        <TableHead>
                                                            <TableRow>
                                                                {columns.map((column) => (
                                                                    <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                                                        {column.label}
                                                                    </TableCell>
                                                                ))}
                                                                <TableCell>Action</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {(selectedStatus === '' || selectedStatus !== '') && (
                                                                (rowsPerPage > 0
                                                                    ? (selectedStatus === '' ? leaves : filteredLeaves)
                                                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                    : (selectedStatus === '' ? leaves : filteredLeaves)
                                                                ).map((leave: Leave) => (
                                                                    <TableRow hover role="checkbox" tabIndex={-1} key={leave.Id}>
                                                                        {columns.map((column) => {
                                                                            const value = leave[column.id];
                                                                            return (
                                                                                <TableCell key={column.id} align={column.align}>
                                                                                    {column.id === 'From' || column.id === 'To'
                                                                                        ? this.formatDate(value.toString()) // Format 'From' and 'To' values using formatDate method
                                                                                        : column.id === 'Status'
                                                                                            ? (
                                                                                                <div
                                                                                                    style={{
                                                                                                        display: 'flex',
                                                                                                        alignItems: 'center',
                                                                                                        justifyContent: 'center',
                                                                                                        width: '80px',
                                                                                                        height: '30px',
                                                                                                        borderRadius: '5px',
                                                                                                        border: `2px solid ${value === 'Approved' ? 'rgb(89, 208, 255)' : value === 'In Progress' ? 'gray' : 'rgb(11, 41, 72)'}`,
                                                                                                        color: value === 'Approved' ? 'rgb(89, 208, 255)' : value === 'In Progress' ? 'gray' : 'rgb(11, 41, 72)',
                                                                                                        backgroundColor: 'transparent',
                                                                                                        transition: 'background-color 0.3s',
                                                                                                        cursor: 'pointer',
                                                                                                    }}
                                                                                                    onMouseEnter={(e) => {
                                                                                                        const target = e.target as HTMLDivElement;
                                                                                                        if (value === 'Approved') {
                                                                                                            target.style.backgroundColor = 'rgb(89, 208, 255)';
                                                                                                            target.style.color = 'rgb(11, 41, 72)';
                                                                                                        } else if (value === 'In Progress') {
                                                                                                            target.style.backgroundColor = 'gray';
                                                                                                            target.style.color = '#fff';
                                                                                                        } else if (value === 'Refused') {
                                                                                                            target.style.backgroundColor = 'rgb(11, 41, 72)';
                                                                                                            target.style.color = '#fff';
                                                                                                        }
                                                                                                    }}
                                                                                                    onMouseLeave={(e) => {
                                                                                                        const target = e.target as HTMLDivElement;
                                                                                                        if (value === 'Approved') {
                                                                                                            target.style.backgroundColor = 'transparent';
                                                                                                            target.style.color = 'rgb(89, 208, 255)';
                                                                                                        } else if (value === 'In Progress') {
                                                                                                            target.style.backgroundColor = 'transparent';
                                                                                                            target.style.color = 'gray';
                                                                                                        } else if (value === 'Refused') {
                                                                                                            target.style.backgroundColor = 'transparent';
                                                                                                            target.style.color = 'rgb(11, 41, 72)';
                                                                                                        }
                                                                                                    }}


                                                                                                >
                                                                                                    {value}
                                                                                                </div>
                                                                                            )
                                                                                            : column.format && typeof value === 'number'
                                                                                                ? column.format(value)
                                                                                                : value}
                                                                                </TableCell>
                                                                            );
                                                                        })}
                                                                        <TableCell>
                                                                            <div className="buttonDelEdit" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                                                                {leave.Status === "In Progress" ? (
                                                                                    <>
                                                                                        <IconButton aria-label="Approved" style={{ color: "rgb(11, 41, 72)" }} onClick={(event) => this.handleApprove(event, leave)}><TaskAltOutlinedIcon />
                                                                                        </IconButton>
                                                                                        <IconButton aria-label="Refused" onClick={(event) => this.handleRefuse(event, leave)}><CancelOutlinedIcon />
                                                                                        </IconButton>
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <IconButton aria-label="Approved" color="secondary" disabled><TaskAltOutlinedIcon />
                                                                                        </IconButton>
                                                                                        <IconButton aria-label="Refused" color="secondary" disabled><CancelOutlinedIcon />
                                                                                        </IconButton>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )))}
                                                            {emptyRows > 0 && (
                                                                <TableRow style={{ height: 53 * emptyRows }}>
                                                                    <TableCell colSpan={6} />
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                                <TablePagination
                                                    rowsPerPageOptions={[5, 10, 15]}
                                                    component="div"
                                                    count={totalCount}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    onPageChange={this.handleChangePage}
                                                    onRowsPerPageChange={this.handleChangeRowsPerPage}
                                                />
                                            </Paper>
                                        </div>
                                    </div>
                                )}

                                {employees.map((employee) => { //Manager
                                    if (employee.JobTitle === "Manager" && user.Title === `${employee.FirstName} ${employee.LastName}`) {
                                        if (isAllLeavesManager) {
                                            return(
                                                <div>
                                                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                                                        <FormControl>
                                                            <RadioGroup
                                                                row
                                                                name="row-radio-buttons-group"
                                                                value={this.state.selectedStatus} // Set the selectedStatus from component state
                                                                onChange={this.handleStatusChangeForManagerLeaves} // Update the method name
                                                            >
                                                                <FormControlLabel value="" control={<Radio size="small" />} label="All" />
                                                                <FormControlLabel value="In Progress" style={{ marginLeft: "10px" }} control={<Radio size="small" />} label="In Progress" />
                                                                <FormControlLabel value="Approved" style={{ marginLeft: "10px" }} control={<Radio size="small" />} label="Approved" />
                                                                <FormControlLabel value="Refused" style={{ marginLeft: "10px" }} control={<Radio size="small" />} label="Refused" />
                                                            </RadioGroup>
                                                        </FormControl>
                                                    </div>
                                                    <div>
                                                        <Paper sx={{ maxWidth: '100%', overflow: 'hidden' }}>
                                                            <TableContainer sx={{ maxHeight: 300 }}>
                                                                <Table stickyHeader aria-label="sticky table">
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            {columns.map((column) => (
                                                                                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                                                                    {column.label}
                                                                                </TableCell>
                                                                            ))}
                                                                            <TableCell>Action</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {(selectedStatus === '' || selectedStatus !== '') && (
                                                                            (rowsPerPage > 0
                                                                                ? (selectedStatus === '' ? filteredLeavesOfManager : filteredLeaves)
                                                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                                : (selectedStatus === '' ? filteredLeavesOfManager : filteredLeaves)
                                                                            ).map((leave: Leave) => (
                                                                                <TableRow hover role="checkbox" tabIndex={-1} key={leave.Id}>
                                                                                    {columns.map((column) => {
                                                                                        const value = leave[column.id];
                                                                                        return (
                                                                                            <TableCell key={column.id} align={column.align}>
                                                                                                {column.id === 'From' || column.id === 'To'
                                                                                                    ? this.formatDate(value.toString()) // Format 'From' and 'To' values using formatDate method
                                                                                                    : column.id === 'Status'
                                                                                                        ? (
                                                                                                            <div
                                                                                                                style={{
                                                                                                                    display: 'flex',
                                                                                                                    alignItems: 'center',
                                                                                                                    justifyContent: 'center',
                                                                                                                    width: '80px',
                                                                                                                    height: '30px',
                                                                                                                    borderRadius: '5px',
                                                                                                                    border: `2px solid ${value === 'Approved' ? 'rgb(89, 208, 255)' : value === 'In Progress' ? 'gray' : 'rgb(11, 41, 72)'}`,
                                                                                                                    color: value === 'Approved' ? 'rgb(89, 208, 255)' : value === 'In Progress' ? 'gray' : 'rgb(11, 41, 72)',
                                                                                                                    backgroundColor: 'transparent',
                                                                                                                    transition: 'background-color 0.3s',
                                                                                                                    cursor: 'pointer',
                                                                                                                }}
                                                                                                                onMouseEnter={(e) => {
                                                                                                                    const target = e.target as HTMLDivElement;
                                                                                                                    if (value === 'Approved') {
                                                                                                                        target.style.backgroundColor = 'rgb(89, 208, 255)';
                                                                                                                        target.style.color = 'rgb(11, 41, 72)';
                                                                                                                    } else if (value === 'In Progress') {
                                                                                                                        target.style.backgroundColor = 'gray';
                                                                                                                        target.style.color = '#fff';
                                                                                                                    } else if (value === 'Refused') {
                                                                                                                        target.style.backgroundColor = 'rgb(11, 41, 72)';
                                                                                                                        target.style.color = '#fff';
                                                                                                                    }
                                                                                                                }}
                                                                                                                onMouseLeave={(e) => {
                                                                                                                    const target = e.target as HTMLDivElement;
                                                                                                                    if (value === 'Approved') {
                                                                                                                        target.style.backgroundColor = 'transparent';
                                                                                                                        target.style.color = 'rgb(89, 208, 255)';
                                                                                                                    } else if (value === 'In Progress') {
                                                                                                                        target.style.backgroundColor = 'transparent';
                                                                                                                        target.style.color = 'gray';
                                                                                                                    } else if (value === 'Refused') {
                                                                                                                        target.style.backgroundColor = 'transparent';
                                                                                                                        target.style.color = 'rgb(11, 41, 72)';
                                                                                                                    }
                                                                                                                }}
    
    
                                                                                                            >
                                                                                                                {value}
                                                                                                            </div>
                                                                                                        )
                                                                                                        : column.format && typeof value === 'number'
                                                                                                            ? column.format(value)
                                                                                                            : value}
                                                                                            </TableCell>
                                                                                        );
                                                                                    })}
                                                                                    <TableCell>
                                                                                        <div className="buttonDelEdit" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                                                                            {leave.Status === "In Progress" ? (
                                                                                                <>
                                                                                                    <IconButton aria-label="Approved" style={{ color: "rgb(11, 41, 72)" }} onClick={(event) => this.handleApprove(event, leave)}><TaskAltOutlinedIcon />
                                                                                                    </IconButton>
                                                                                                    <IconButton aria-label="Refused" onClick={(event) => this.handleRefuse(event, leave)}><CancelOutlinedIcon />
                                                                                                    </IconButton>
                                                                                                </>
                                                                                            ) : (
                                                                                                <>
                                                                                                    <IconButton aria-label="Approved" color="secondary" disabled><TaskAltOutlinedIcon />
                                                                                                    </IconButton>
                                                                                                    <IconButton aria-label="Refused" color="secondary" disabled><CancelOutlinedIcon />
                                                                                                    </IconButton>
                                                                                                </>
                                                                                            )}
                                                                                        </div>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            )))}
                                                                        {emptyRows > 0 && (
                                                                            <TableRow style={{ height: 53 * emptyRows }}>
                                                                                <TableCell colSpan={6} />
                                                                            </TableRow>
                                                                        )}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                            <TablePagination
                                                                rowsPerPageOptions={[5, 10, 15]}
                                                                component="div"
                                                                count={totalCount}
                                                                rowsPerPage={rowsPerPage}
                                                                page={page}
                                                                onPageChange={this.handleChangePage}
                                                                onRowsPerPageChange={this.handleChangeRowsPerPage}
                                                            />
                                                        </Paper>
                                                    </div>
                                                </div>
                                            )
                                        } else {
                                        return (
                                            <div>
                                                <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                                                    <FormControl>
                                                        <RadioGroup
                                                            row
                                                            name="row-radio-buttons-group"
                                                            value={this.state.selectedStatus} // Set the selectedStatus from component state
                                                            onChange={this.handleStatusChangeForManager} // Update the method name
                                                        >
                                                            <FormControlLabel value="" control={<Radio size="small" />} label="All" />
                                                            <FormControlLabel value="In Progress" style={{ marginLeft: "10px" }} control={<Radio size="small" />} label="In Progress" />
                                                            <FormControlLabel value="Approved" style={{ marginLeft: "10px" }} control={<Radio size="small" />} label="Approved" />
                                                            <FormControlLabel value="Refused" style={{ marginLeft: "10px" }} control={<Radio size="small" />} label="Refused" />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </div>
                                                <div>
                                                    <Paper sx={{ maxWidth: '100%', overflow: 'hidden' }}>
                                                        <TableContainer sx={{ maxHeight: 300 }}>
                                                            <Table stickyHeader aria-label="sticky table">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        {columns.map((column) => (
                                                                            <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                                                                {column.label}
                                                                            </TableCell>
                                                                        ))}
                                                                        <TableCell>Action</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {(selectedStatus === '' || selectedStatus !== '') && (
                                                                        (rowsPerPage > 0
                                                                            ? (selectedStatus === '' ? filteredLeavesViaLineManager : filteredLeaves)
                                                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                            : (selectedStatus === '' ? filteredLeavesViaLineManager : filteredLeaves)
                                                                        ).map((leave: Leave) => (
                                                                            <TableRow hover role="checkbox" tabIndex={-1} key={leave.Id}>
                                                                                {columns.map((column) => {
                                                                                    const value = leave[column.id];
                                                                                    return (
                                                                                        <TableCell key={column.id} align={column.align}>
                                                                                            {column.id === 'From' || column.id === 'To'
                                                                                                ? this.formatDate(value?.toString()) // Format 'From' and 'To' values using formatDate method
                                                                                                : column.id === 'Status'
                                                                                                    ? (
                                                                                                        <div
                                                                                                            style={{
                                                                                                                display: 'flex',
                                                                                                                alignItems: 'center',
                                                                                                                justifyContent: 'center',
                                                                                                                width: '80px',
                                                                                                                height: '30px',
                                                                                                                borderRadius: '5px',
                                                                                                                border: `2px solid ${value === 'Approved' ? 'rgb(89, 208, 255)' : value === 'In Progress' ? 'gray' : 'rgb(11, 41, 72)'}`,
                                                                                                                color: value === 'Approved' ? 'rgb(89, 208, 255)' : value === 'In Progress' ? 'gray' : 'rgb(11, 41, 72)',
                                                                                                                backgroundColor: 'transparent',
                                                                                                                transition: 'background-color 0.3s',
                                                                                                                cursor: 'pointer',
                                                                                                            }}
                                                                                                            onMouseEnter={(e) => {
                                                                                                                const target = e.target as HTMLDivElement;
                                                                                                                if (value === 'Approved') {
                                                                                                                    target.style.backgroundColor = 'rgb(89, 208, 255)';
                                                                                                                    target.style.color = 'rgb(11, 41, 72)';
                                                                                                                } else if (value === 'In Progress') {
                                                                                                                    target.style.backgroundColor = 'gray';
                                                                                                                    target.style.color = '#fff';
                                                                                                                } else if (value === 'Refused') {
                                                                                                                    target.style.backgroundColor = 'rgb(11, 41, 72)';
                                                                                                                    target.style.color = '#fff';
                                                                                                                }
                                                                                                            }}
                                                                                                            onMouseLeave={(e) => {
                                                                                                                const target = e.target as HTMLDivElement;
                                                                                                                if (value === 'Approved') {
                                                                                                                    target.style.backgroundColor = 'transparent';
                                                                                                                    target.style.color = 'rgb(89, 208, 255)';
                                                                                                                } else if (value === 'In Progress') {
                                                                                                                    target.style.backgroundColor = 'transparent';
                                                                                                                    target.style.color = 'gray';
                                                                                                                } else if (value === 'Refused') {
                                                                                                                    target.style.backgroundColor = 'transparent';
                                                                                                                    target.style.color = 'rgb(11, 41, 72)';
                                                                                                                }
                                                                                                            }}


                                                                                                        >
                                                                                                            {value}
                                                                                                        </div>
                                                                                                    )
                                                                                                    : column.format && typeof value === 'number'
                                                                                                        ? column.format(value)
                                                                                                        : value}
                                                                                        </TableCell>
                                                                                    );
                                                                                })}
                                                                                <TableCell>
                                                                                    <div className="buttonDelEdit" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                                                                        {leave.Status === "In Progress" ? (
                                                                                            <>
                                                                                                <IconButton aria-label="Approved" style={{ color: "rgb(11, 41, 72)" }} onClick={(event) => this.handleApprove(event, leave)}><TaskAltOutlinedIcon />
                                                                                                </IconButton>
                                                                                                <IconButton aria-label="Refused" onClick={(event) => this.handleRefuse(event, leave)}><CancelOutlinedIcon />
                                                                                                </IconButton>
                                                                                            </>
                                                                                        ) : (
                                                                                            <>
                                                                                                <IconButton aria-label="Approved" color="secondary" disabled><TaskAltOutlinedIcon />
                                                                                                </IconButton>
                                                                                                <IconButton aria-label="Refused" color="secondary" disabled><CancelOutlinedIcon />
                                                                                                </IconButton>
                                                                                            </>
                                                                                        )}
                                                                                    </div>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        )))}
                                                                    {emptyRows > 0 && (
                                                                        <TableRow style={{ height: 53 * emptyRows }}>
                                                                            <TableCell colSpan={6} />
                                                                        </TableRow>
                                                                    )}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                        <TablePagination
                                                            rowsPerPageOptions={[5, 10, 15]}
                                                            component="div"
                                                            count={totalCount}
                                                            rowsPerPage={rowsPerPage}
                                                            page={page}
                                                            onPageChange={this.handleChangePage}
                                                            onRowsPerPageChange={this.handleChangeRowsPerPage}
                                                        />
                                                    </Paper>
                                                </div>
                                            </div>
                                        )}
                                    }
                                })}


                                {!user.IsSiteAdmin && (!employees.some((employee) => employee.JobTitle === "Manager" && user.Title === `${employee.FirstName} ${employee.LastName}`)) && (//only Employee
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                                            <FormControl>
                                                <RadioGroup
                                                    row
                                                    name="row-radio-buttons-group"
                                                    value={this.state.selectedStatus} // Set the selectedStatus from component state
                                                    onChange={this.handleStatusChangeForEmployee} // Update the method name
                                                >
                                                    <FormControlLabel value="" control={<Radio size="small" />} label="All" />
                                                    <FormControlLabel value="In Progress" style={{ marginLeft: "10px" }} control={<Radio size="small" />} label="In Progress" />
                                                    <FormControlLabel value="Approved" style={{ marginLeft: "10px" }} control={<Radio size="small" />} label="Approved" />
                                                    <FormControlLabel value="Refused" style={{ marginLeft: "10px" }} control={<Radio size="small" />} label="Refused" />
                                                </RadioGroup>
                                            </FormControl>
                                        </div>
                                        <div>
                                            <Paper sx={{ maxWidth: '100%', overflow: 'hidden' }}>
                                                <TableContainer sx={{ maxHeight: 300 }}>
                                                    <Table stickyHeader aria-label="sticky table">
                                                        <TableHead>
                                                            <TableRow>
                                                                {columns.map((column) => (
                                                                    <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                                                        {column.label}
                                                                    </TableCell>
                                                                ))}
                                                                <TableCell>Action</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>

                                                            {((selectedStatus === '' && filteredLeavesViaEmployee) || selectedStatus !== '') && (
                                                                (rowsPerPage > 0
                                                                    ? (selectedStatus === '' ? filteredLeavesViaEmployee : filteredLeaves)
                                                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                    : (selectedStatus === '' ? filteredLeavesViaEmployee : filteredLeaves)
                                                                ).map((leave: Leave) => (
                                                                    <TableRow hover role="checkbox" tabIndex={-1} key={leave.Id}>
                                                                        {columns.map((column) => {
                                                                            const value = leave[column.id];
                                                                            return (
                                                                                <TableCell key={column.id} align={column.align}>
                                                                                    {column.id === 'From' || column.id === 'To'
                                                                                        ? this.formatDate(value.toString()) // Format 'From' and 'To' values using formatDate method
                                                                                        : column.id === 'Status'
                                                                                            ? (
                                                                                                <div
                                                                                                    style={{
                                                                                                        display: 'flex',
                                                                                                        alignItems: 'center',
                                                                                                        justifyContent: 'center',
                                                                                                        width: '80px',
                                                                                                        height: '30px',
                                                                                                        borderRadius: '5px',
                                                                                                        border: `2px solid ${value === 'Approved' ? 'rgb(89, 208, 255)' : value === 'In Progress' ? 'gray' : 'rgb(11, 41, 72)'}`,
                                                                                                        color: value === 'Approved' ? 'rgb(89, 208, 255)' : value === 'In Progress' ? 'gray' : 'rgb(11, 41, 72)',
                                                                                                        backgroundColor: 'transparent',
                                                                                                        transition: 'background-color 0.3s',
                                                                                                        cursor: 'pointer',
                                                                                                    }}
                                                                                                    onMouseEnter={(e) => {
                                                                                                        const target = e.target as HTMLDivElement;
                                                                                                        if (value === 'Approved') {
                                                                                                            target.style.backgroundColor = 'rgb(89, 208, 255)';
                                                                                                            target.style.color = 'rgb(11, 41, 72)';
                                                                                                        } else if (value === 'In Progress') {
                                                                                                            target.style.backgroundColor = 'gray';
                                                                                                            target.style.color = '#fff';
                                                                                                        } else if (value === 'Refused') {
                                                                                                            target.style.backgroundColor = 'rgb(11, 41, 72)';
                                                                                                            target.style.color = '#fff';
                                                                                                        }
                                                                                                    }}
                                                                                                    onMouseLeave={(e) => {
                                                                                                        const target = e.target as HTMLDivElement;
                                                                                                        if (value === 'Approved') {
                                                                                                            target.style.backgroundColor = 'transparent';
                                                                                                            target.style.color = 'rgb(89, 208, 255)';
                                                                                                        } else if (value === 'In Progress') {
                                                                                                            target.style.backgroundColor = 'transparent';
                                                                                                            target.style.color = 'gray';
                                                                                                        } else if (value === 'Refused') {
                                                                                                            target.style.backgroundColor = 'transparent';
                                                                                                            target.style.color = 'rgb(11, 41, 72)';
                                                                                                        }
                                                                                                    }}


                                                                                                >
                                                                                                    {value}
                                                                                                </div>
                                                                                            )
                                                                                            : column.format && typeof value === 'number'
                                                                                                ? column.format(value)
                                                                                                : value}
                                                                                </TableCell>
                                                                            );
                                                                        })}
                                                                        <TableCell>
                                                                            <div className="buttonDelEdit" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                                                                {leave.Status === "In Progress" ? (
                                                                                    <>
                                                                                        <IconButton aria-label="edit" onClick={() => this.handleUpdateLeaveRequest(leave.Id)}>
                                                                                            <EditIcon style={{ color: "rgb(89, 208, 255)" }} />
                                                                                        </IconButton>
                                                                                        <IconButton aria-label="delete" onClick={() => this.handleDeleteLeave(leave.Id)}>
                                                                                            <DeleteIcon style={{ color: " rgb(11, 41, 72)" }} />
                                                                                        </IconButton>
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <IconButton aria-label="edit" color="secondary" disabled>
                                                                                            <EditIcon />
                                                                                        </IconButton>
                                                                                        <IconButton aria-label="delete" color="secondary" disabled>
                                                                                            <DeleteIcon />
                                                                                        </IconButton>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </TableCell>

                                                                    </TableRow>
                                                                )))
                                                            }
                                                            {emptyRows > 0 && (
                                                                <TableRow style={{ height: 53 * emptyRows }}>
                                                                    <TableCell colSpan={6} />
                                                                </TableRow>
                                                            )}

                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                                <TablePagination
                                                    rowsPerPageOptions={[5, 10, 15]}
                                                    component="div"
                                                    count={totalCount}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    onPageChange={this.handleChangePage}
                                                    onRowsPerPageChange={this.handleChangeRowsPerPage}
                                                />
                                            </Paper>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                )
                }
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): StateProps => ({
    leaves: state.leaves,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    fetchLeaves: () => {
        dispatch(getLeavesRequest()); // Dispatch the request action
        getLeaves()
            .then((leaves) => {
                dispatch(getLeavesSuccess(leaves)); // Dispatch the success action with the fetched leaves
            })
            .catch((error) => {
                dispatch(getLeavesFailure(error.message)); // Dispatch the failure action with the error message
            });
    },
    deleteLeave: (Id: string) => {
        dispatch(getLeavesRequest()); // Dispatch the request action
        deleteLeave(Id)
            .then(() => {
                dispatch(deleteLeaveSuccess(Id));
                getLeaves()
                    .then((leaves) => {
                        dispatch(getLeavesSuccess(leaves)); // Dispatch the success action with the fetched leaves
                    })
                    .catch((error) => {
                        dispatch(getLeavesFailure(error.message)); // Dispatch the failure action with the error message
                    });
            })
            .catch((error: Error) => dispatch(deleteLeaveFailure(error.message)));
    },
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(LeavesList)
);


