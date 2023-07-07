import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { getEmployees, deleteEmployee } from '../../services/EmployeeService';
import { RootState } from '../../store/reducers/RootReducer';
import { deleteEmployeeSuccess, deleteEmployeeFailure, getEmployeesFailure, getEmployeesSuccess, getEmployeesRequest, addEmployeeSuccess, addEmployeeFailure } from '../../store/actions/actions';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PageHeader from '../pageheader/Pageheader';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { Button, Checkbox, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, IconButton, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';

interface IEmployeesListProps extends RouteComponentProps {
  employees: Employee[];
  fetchEmployees: () => void;
  deleteEmployee: (itemId: string) => void;
  user: SharePointUser;
}

interface DispatchProps {
  fetchEmployees: () => void;
  deleteEmployee: (Id: string) => void;
}
interface StateProps {
  employees: Employee[];
}

interface IEmployeesListState {
  page: number;
  rowsPerPage: number;
  anchorEl: undefined | HTMLElement;
  openPopup: boolean;
  selectedDepartments: string[];
  showDialog: boolean, // Indicates whether the custom dialog should be displayed
  deleteItemId: number,
  filteredEmployees: Employee[];
}

interface Column {
  id: keyof Employee;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  // { id: 'EmployeeId', label: 'Employee ID', minWidth: 160 },
  { id: 'FirstName', label: 'First Name', minWidth: 160 },
  { id: 'LastName', label: 'Last Name', minWidth: 160 },
  { id: 'LineManager', label: 'Line Manager', minWidth: 160 },
  { id: 'Nationality', label: 'Nationality', minWidth: 160 },
  { id: 'DateOfBirth', label: 'Date of Birth', minWidth: 160 },
  { id: 'Gender', label: 'Gender', minWidth: 160 },
  { id: 'PhoneNumber', label: 'Phone Number', minWidth: 160 },
  { id: 'SecondaryPhoneNumber', label: 'Secondary Phone Number', minWidth: 160 },
  { id: 'PersonalEmail', label: 'Personal Email', minWidth: 160 },
  { id: 'ProfessionalEmail', label: 'Professional Email', minWidth: 160 },
  { id: 'Linkedin', label: 'LinkedIn', minWidth: 160 },
  { id: 'StartDate', label: 'Start Date', minWidth: 160 },
  { id: 'EndDate', label: 'End Date', minWidth: 160 },
  { id: 'DaysAllowed', label: 'Days Allowed', minWidth: 160 },
  { id: 'EmploymentType', label: 'Employment Type', minWidth: 160 },
  { id: 'JobTitle', label: 'Job Title', minWidth: 160 },
  { id: 'Department', label: 'Department', minWidth: 160 },
];

class EmployeesList extends React.Component<IEmployeesListProps, IEmployeesListState> {
  // navigate: any;

  constructor(props: IEmployeesListProps) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 5,
      anchorEl: null,
      openPopup: false,
      selectedDepartments: [],
      showDialog: false,
      deleteItemId: null,
      filteredEmployees: []
    };
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

  handleOpenPopup = (): void => {
    this.setState({ openPopup: true });
  };
  handleClosePopup = (): void => {
    this.setState({ openPopup: false });
  };

  public componentDidMount(): void {
    this.props.fetchEmployees();
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
  private handleDeleteEmployee = (Id: number): void => {
    this.openDialog(Id);
  };

  private handleDeleteConfirmed = (): void => {
    const itemId = this.state.deleteItemId.toString();

    try {
      this.props.deleteEmployee(itemId); // Delete the employee
      this.props.fetchEmployees(); // Fetch updated leave request list
      this.closeDialog(); // Close the custom dialog
    } catch (error) {
      console.error('Failed to delete employee:', error);
    }
  };

  handleToggleDepartment = (department: string): void => {
    this.setState((prevState) => {
      const { selectedDepartments } = prevState;
      if (selectedDepartments.includes(department)) {
        return {
          selectedDepartments: selectedDepartments.filter((dep) => dep !== department)
        };
      } else {
        return {
          selectedDepartments: [...selectedDepartments, department]
        };
      }
    });
  };


  handleFilterByDepartment = (): void => {
    const { employees, user } = this.props;
    const { selectedDepartments } = this.state;

    // Perform the filtering logic based on the selected departments
    const filteredEmployees = employees.filter((employee) =>
      selectedDepartments.some((department) =>
        employee.Department.includes(department)
      ) && (user.Title === employee.LineManager)
    );

    this.setState({ filteredEmployees });
    this.handleClosePopup();

  };

  private handleAddEmployee = (): void => {
    this.props.history.push('/employees/addEmployee'); // Navigate to the "/addEmployee" route
  };

  private handleUpdateEmployee = (Id: number): void => {
    this.props.history.push(`/employees/updateEmployee/${Id}`); // Navigate to the "/updateEmployee/:id" route
  };

  private handleMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  private handleMenuClose = (): void => {
    this.setState({
      anchorEl: null
    });
  };

  private handleMenuClick = (option: string): void => {
    if (option === 'Hours Worked') {
      this.props.history.push('/employees/hours-worked');
      this.handleMenuClose();
    } else {
      this.props.history.push('/employees/departments');
      this.handleMenuClose();
    }
  };
  handleGoBack = (): void => {
    const { history } = this.props;
    history.goBack();
  };

  private formatDate = (date: string): string => {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    return formattedDate;
  };

  public render(): JSX.Element {
    const { employees, user } = this.props;
    const { page, rowsPerPage, openPopup, selectedDepartments, filteredEmployees } = this.state;  //filteredEmployees
    const totalCount = employees.length;

    const filteredEmployeesByDepartment = employees.filter((employee) => {
      return user.Title === employee.LineManager;
    });

    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, totalCount - page * rowsPerPage);

    const { anchorEl } = this.state;
    const isMenuOpen = Boolean(anchorEl);
    return (
      <div>
        <ArrowBackOutlinedIcon onClick={this.handleGoBack} sx={{ color: "rgb(139, 161, 183)" }} />
        <Dialog
          open={this.state.showDialog}
          onClose={this.closeDialog}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete this employee?
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
        <Dialog open={openPopup} onClose={this.handleClosePopup}>
          <DialogTitle>Select Department</DialogTitle>
          <DialogContent>
            {(() => {
              const uniqueDepartments: string[] = [];
              for (const employee of filteredEmployeesByDepartment) {
                for (const department of employee.Department) {
                  if (!uniqueDepartments.includes(department)) {
                    uniqueDepartments.push(department);
                  }
                }
              }
              return uniqueDepartments.map((department) => (
                <FormControlLabel
                  key={department}
                  control={
                    <Checkbox
                      checked={selectedDepartments.includes(department)}
                      onChange={() => this.handleToggleDepartment(department)}
                      name={department}
                    />
                  }
                  label={department}
                />
              ));
            })()}
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleClosePopup} style={{ color: "#fff", backgroundColor: "rgb(11, 41, 72)" }}>
              Cancel
            </Button>
            <Button onClick={this.handleFilterByDepartment} style={{ color: "rgb(11, 41, 72)", backgroundColor: "rgb(89, 208, 255)" }}>
              Apply
            </Button>
          </DialogActions>
        </Dialog>
        {user && (
          <>
            {user.IsSiteAdmin && !employees.some((employee) => employee.JobTitle === "Manager" && user.Title === `${employee.FirstName} ${employee.LastName}`) && (// only Admin
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                <PageHeader
                  title="Employees"
                  subTitle="List of all the employees in the organization!"
                  icon={<GroupsOutlinedIcon fontSize="large" style={{ color: "rgb(11, 41, 72)" }} />}
                />
                <Button variant="contained" size="small" onClick={this.handleAddEmployee} style={{ color: "rgb(139, 161, 183)", backgroundColor: "rgb(11, 41, 72)" }} endIcon={<AddCircleOutlineIcon style={{ color: "rgb(89, 208, 255)" }} />} >Add</Button>
              </div>
            )}
            {employees.map((employee) => { //Manager
              if (employee.JobTitle === "Manager" && user.Title === `${employee.FirstName} ${employee.LastName}`) {
                return (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                    <PageHeader
                      title="Employees"
                      subTitle={`Welcome Manager ${user.Title},This a list of all the employees you are managing!`}
                      icon={<GroupsOutlinedIcon fontSize="large" style={{ color: "rgb(11, 41, 72)" }} />}
                    />
                    <Button variant="contained" size="small" onClick={this.handleOpenPopup} style={{ color: "rgb(139, 161, 183)", backgroundColor: "rgb(11, 41, 72)" }} endIcon={<TuneOutlinedIcon style={{ color: "rgb(89, 208, 255)" }} />} >Filter</Button>
                  </div>
                );
              }
            })}
          </>
        )}

        {user.IsSiteAdmin && !employees.some((employee) => employee.JobTitle === "Manager" && user.Title === `${employee.FirstName} ${employee.LastName}`) && (// only Admin
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
            <IconButton
              aria-label="filter"
              onClick={this.handleMenuOpen}
              size="small"
              style={{ color: 'rgb(139, 161, 183)' }}
            >
              <ExpandMoreIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={isMenuOpen}
              onClose={this.handleMenuClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              <MenuItem onClick={() => this.handleMenuClick('Hours Worked')}>
                <span>Hours Worked</span>
              </MenuItem>
              <MenuItem onClick={() => this.handleMenuClick('Departments')}>
                <span>Departments</span>
              </MenuItem>
            </Menu>
          </div>
        )}
        {employees.map((employee) => { //Manager
          if (employee.JobTitle === "Manager" && user.Title === `${employee.FirstName} ${employee.LastName}`) {
            return (
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
                <IconButton
                  aria-label="filter"
                  onClick={this.handleMenuOpen}
                  size="small"
                  style={{ color: 'rgb(139, 161, 183)' }}
                >
                  <ExpandMoreIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={isMenuOpen}
                  onClose={this.handleMenuClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                >
                  <MenuItem onClick={() => this.handleMenuClick('Hours Worked')}>
                    <span>Hours Worked</span>
                  </MenuItem>
                </Menu>
              </div>
            )
          }
        })}
        {employees.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress sx={{ color: "rgb(89, 208, 255)" }} />
          </div>
        ) : (
          <>
            {user && (
              <div>
                {user.IsSiteAdmin && !employees.some((employee) => employee.JobTitle === "Manager" && user.Title === `${employee.FirstName} ${employee.LastName}`) && (// only Admin
                  <Paper sx={{ maxWidth: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 300 }}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            {columns.map((column) => {
                              if (column.id === 'LineManager' && filteredEmployeesByDepartment) {
                                return null; // Skip rendering the Line Manager column header
                              }
                              return (
                                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                  {column.label}
                                </TableCell>
                              );
                            })}
                            <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(rowsPerPage > 0
                            ? employees.slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            : employees
                          ).map((employee: Employee) => (
                            <TableRow hover role="checkbox" tabIndex={-1} key={employee.Id}>
                              {columns.map((column) => {
                                const value = employee[column.id];
                                return (
                                  <TableCell key={column.id} align={column.align}>
                                    {column.id === 'LineManager' ? (
                                      <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          width: typeof value === 'string' ? `${(value.length * 8) + 16}px` : 'auto',
                                          height: '30px',
                                          borderRadius: '5px',
                                          border: `2px solid ${value === 'No' ? 'rgb(11, 41, 72)' : 'rgb(89, 208, 255)'}`,
                                          color: value === 'No' ? 'rgb(11, 41, 72)' : 'rgb(89, 208, 255)',
                                          backgroundColor: 'transparent',
                                          transition: 'background-color 0.3s',
                                          cursor: 'pointer',
                                        }}
                                        onMouseEnter={(e) => {
                                          const target = e.target as HTMLDivElement;
                                          if (value === 'No') {
                                            target.style.backgroundColor = 'rgb(11, 41, 72)';
                                            target.style.color = '#fff';
                                          } else {
                                            target.style.backgroundColor = 'rgb(89, 208, 255)';
                                            target.style.color = 'rgb(11, 41, 72)';
                                          }
                                        }}
                                        onMouseLeave={(e) => {
                                          const target = e.target as HTMLDivElement;
                                          if (value === 'No') {
                                            target.style.backgroundColor = 'transparent';
                                            target.style.color = 'rgb(11, 41, 72)';
                                          } else {
                                            target.style.backgroundColor = 'transparent';
                                            target.style.color = 'rgb(89, 208, 255)';
                                          }
                                        }}
                                      >
                                        {value}
                                      </div>
                                    ) : column.id === 'Department' ? (
                                      <div
                                        style={{
                                          display: 'flex',
                                          flexWrap: 'wrap',
                                          gap: '0.2',
                                          //  overflow: 'hidden',
                                          //  textOverflow: 'ellipsis',
                                        }}
                                      >
                                        {employee[column.id].map((department: string) => (
                                          <Chip
                                            label={department}
                                            key={department}
                                            style={{
                                              marginRight: 4, marginBottom: 4, overflow: 'hidden',
                                              textOverflow: 'ellipsis', maxWidth: "100px"
                                            }}
                                          />
                                        ))}
                                      </div>
                                    ) : (
                                      column.id === 'DateOfBirth' ||
                                        column.id === 'StartDate' ||
                                        column.id === 'EndDate' ? (
                                        value !== null ? this.formatDate(value.toString()) : 'N/A'
                                      ) : column.format && typeof value === 'number' ? (
                                        column.format(value)
                                      ) : (
                                        value
                                      )
                                    )}
                                  </TableCell>
                                );
                              })}
                              <TableCell>
                                <div className="buttonDelEdit" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                  <IconButton aria-label="edit" onClick={() => this.handleUpdateEmployee(employee.Id)}> <EditIcon style={{ color: "rgb(89, 208, 255)" }} /> </IconButton>
                                  <IconButton aria-label="delete" color="error" onClick={() => this.handleDeleteEmployee(employee.Id)}> <DeleteIcon style={{ color: " rgb(11, 41, 72)" }} /></IconButton>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
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
                )}

                {employees.map((employee) => { //Manager
                  if (employee.JobTitle === "Manager" && user.Title === `${employee.FirstName} ${employee.LastName}`) {
                    return (
                      <Paper sx={{ maxWidth: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 300 }}>
                          <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                              <TableRow>
                                {columns.map((column) => {
                                  if (column.id === 'LineManager' && filteredEmployeesByDepartment) {
                                    return null; // Skip rendering the Line Manager column header
                                  }
                                  return (
                                    <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                      {column.label}
                                    </TableCell>
                                  );
                                })}
                                <TableCell>Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {(rowsPerPage > 0
                                ? (filteredEmployees.length > 0 ? filteredEmployees : filteredEmployeesByDepartment).slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage
                                )
                                : (filteredEmployees.length > 0 ? filteredEmployees : filteredEmployeesByDepartment)
                              ).map((employee: Employee) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={employee.Id}>
                                  {columns.map((column) => {
                                    const value = employee[column.id];
                                    if (column.id === 'LineManager' && user.Title === value) {
                                      return null;
                                    }
                                    return (
                                      <TableCell key={column.id} align={column.align}>
                                        {column.id === 'LineManager' ? (
                                          <div
                                            style={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              width: typeof value === 'string' ? `${(value.length * 8) + 16}px` : 'auto',
                                              height: '30px',
                                              borderRadius: '5px',
                                              border: `2px solid ${value === 'No' ? 'rgb(11, 41, 72)' : 'rgb(89, 208, 255)'}`,
                                              color: value === 'No' ? 'rgb(11, 41, 72)' : 'rgb(89, 208, 255)',
                                              backgroundColor: 'transparent',
                                              transition: 'background-color 0.3s',
                                              cursor: 'pointer',
                                            }}
                                            onMouseEnter={(e) => {
                                              const target = e.target as HTMLDivElement;
                                              if (value === 'No') {
                                                target.style.backgroundColor = 'rgb(11, 41, 72)';
                                                target.style.color = '#fff';
                                              } else {
                                                target.style.backgroundColor = 'rgb(89, 208, 255)';
                                                target.style.color = 'rgb(11, 41, 72)';
                                              }
                                            }}
                                            onMouseLeave={(e) => {
                                              const target = e.target as HTMLDivElement;
                                              if (value === 'No') {
                                                target.style.backgroundColor = 'transparent';
                                                target.style.color = 'rgb(11, 41, 72)';
                                              } else {
                                                target.style.backgroundColor = 'transparent';
                                                target.style.color = 'rgb(89, 208, 255)';
                                              }
                                            }}
                                          >
                                            {value}
                                          </div>
                                        ) : column.id === 'Department' ? (
                                          <div
                                            style={{
                                              display: 'flex',
                                              flexWrap: 'wrap',
                                              gap: '0.2',
                                              //  overflow: 'hidden',
                                              //  textOverflow: 'ellipsis',
                                            }}
                                          >
                                            {employee[column.id].map((department: string) => (
                                              <Chip
                                                label={department}
                                                key={department}
                                                style={{
                                                  marginRight: 4, marginBottom: 4, overflow: 'hidden',
                                                  textOverflow: 'ellipsis', maxWidth: "100px"
                                                }}
                                              />
                                            ))}
                                          </div>
                                        ) : (
                                          column.id === 'DateOfBirth' ||
                                            column.id === 'StartDate' ||
                                            column.id === 'EndDate' ? (
                                            <div
                                              style={{
                                                color: column.id === 'EndDate' && value !== null ? 'green' : 'inherit',
                                              }}>
                                              {value !== null ? this.formatDate(value.toString()) : 'N/A'}
                                            </div>
                                          ) : column.format && typeof value === 'number' ? (
                                            column.format(value)
                                          ) : (
                                            value
                                          )
                                        )}
                                      </TableCell>
                                    );
                                  })}
                                  <TableCell>
                                    <div className="buttonDelEdit" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                      <IconButton aria-label="edit" onClick={() => this.handleUpdateEmployee(employee.Id)}> <EditIcon style={{ color: "rgb(89, 208, 255)" }} /> </IconButton>
                                      <IconButton aria-label="delete" color="error" onClick={() => this.handleDeleteEmployee(employee.Id)}> <DeleteIcon style={{ color: " rgb(11, 41, 72)" }} /></IconButton>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
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
                    );
                  }
                })}
                </div>
            )}
            </>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  employees: state.employees,
});


const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  fetchEmployees: () => {
    dispatch(getEmployeesRequest()); // Dispatch the request action
    getEmployees()
      .then((employees) => {
        dispatch(getEmployeesSuccess(employees)); // Dispatch the success action with the fetched employees
      })
      .catch((error) => {
        dispatch(getEmployeesFailure(error.message)); // Dispatch the failure action with the error message
      });
  },
  deleteEmployee: (employeeId: string) => {
    dispatch(getEmployeesRequest()); // Dispatch the request action
    deleteEmployee(employeeId)
      .then(() => {
        dispatch(deleteEmployeeSuccess(employeeId));
        getEmployees()
          .then(() => {
            dispatch(addEmployeeSuccess());
          })
          .catch((error: Error) => {
            dispatch(addEmployeeFailure(error.message));
          });
      })
      .catch((error) => dispatch(deleteEmployeeFailure(error.message)));
  },
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EmployeesList)
);

