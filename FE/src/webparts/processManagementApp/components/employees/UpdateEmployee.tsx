import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';
import { editEmployee, getEmployees, getEmployeesById } from '../../services/EmployeeService';
import { editEmployeeSuccess, editEmployeeFailure, addEmployeeSuccess, addEmployeeFailure } from '../../store/actions/actions';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PageHeader from '../pageheader/Pageheader';
import { Box, TextField, Button, MenuItem, CircularProgress, InputLabel, Select, OutlinedInput, Chip, SelectChangeEvent, FormControl } from '@mui/material';
import { ChangeEvent } from 'react';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

interface IUpdateEmployeeProps {
  Id: number;
  updateEmployee: (employeeData: Employee) => void;
  user: SharePointUser;
}
type DispatchProps = {
  updateEmployee: (employeeData: Employee) => void;
  // Define other action creators as needed
};
type PropsFromRouter = RouteComponentProps;
type Props = ConnectedProps<typeof connector> & IUpdateEmployeeProps;

interface IUpdateEmployeeState {
  employeeData: Employee | undefined;
  isLoading: boolean;
  employees: Employee[];
}

type EmployeeFormProps = Props & PropsFromRouter;

class UpdateEmployee extends React.Component<EmployeeFormProps, IUpdateEmployeeState> {
  constructor(props: EmployeeFormProps) {
    super(props);
    this.state = {
      employeeData: null,
      isLoading: true,
      employees: [],
    };
  }

  public async componentDidMount(): Promise<void> {
    // const { employeeId } = this.props;
    await this.fetchEmployeeData();
    await this.fetchEmployees();
  }

  fetchEmployees = async (): Promise<void> => {
    try {
      const response = await getEmployees();// Replace with your actual API endpoint
      this.setState({ employees: response });
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  private fetchEmployeeData = async (): Promise<void> => {
    const { Id } = this.props;
    try {
      const data = await getEmployeesById(Id.toString());
      if (data) {
        this.setState({
          employeeData: data,
          isLoading: false,
        });
      } else {
        throw new Error('Employee not found');
      }
    } catch (error) {
      throw new Error('Failed to fetch employee data');
    }
  };

  private handleFormSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const { employeeData } = this.state;
    if (employeeData) {
      this.props.updateEmployee(employeeData);
    }
    // Redirect to employeesList page
    this.props.history.push('/employees');
  };

  private handleInputChange = (event: ChangeEvent<{ name: string; value: unknown }>): void => {
    const { name, value } = event.target;
    let convertedValue: string | Date = value as string;

    if (name === 'DateOfBirth' || name === 'StartDate' || name === 'EndDate') {
      const date = new Date(value as string);
      convertedValue = date.toISOString().split('T')[0]; // Format as "yyyy-MM-dd"
    }

    this.setState((prevState) => ({
      employeeData: {
        ...prevState.employeeData,
        [name]: convertedValue,
      },
    }));
  };
  handleSelectChange = (event: SelectChangeEvent<string[]>): void => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      employeeData: {
        ...prevState.employeeData,
        [name]: value,
      },
    }));
  };


  handleGoBack = (): void => {
    const { history } = this.props;
    history.goBack();
  };

  public render(): JSX.Element {
    const { employeeData, isLoading, employees } = this.state;
    const { user } = this.props;

    const managerEmployees = employees.filter(
      (employee) => employee.JobTitle === 'Manager'
    );
    const isLineManagerDisabled = employeeData?.JobTitle === 'Manager';
    const formattedDateOfBirth = employeeData?.DateOfBirth ? format(parseISO(employeeData.DateOfBirth.toString()), 'yyyy-MM-dd') : '';
    const formattedStartDate = employeeData?.StartDate ? format(parseISO(employeeData.StartDate.toString()), 'yyyy-MM-dd') : '';
    const formattedEndDate = employeeData?.EndDate && employeeData?.EndDate !== null ? format(parseISO(employeeData.EndDate.toString()), 'yyyy-MM-dd') : '';

    if (isLoading) {
      return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress sx={{ color: "rgb(89, 208, 255)" }} />
      </div>
    }

    return (
      <div>
        <ArrowBackOutlinedIcon onClick={this.handleGoBack} sx={{ color: "rgb(139, 161, 183)" }} />
        <PageHeader
          title="Update Employee"
          subTitle="Edit an employee's information"
          icon={<GroupsOutlinedIcon fontSize="large" style={{ color: "rgb(11, 41, 72)" }} />}
        />

        <form onSubmit={this.handleFormSubmit}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {/* Form fields */}
            <div>
              <TextField
                label="Employee ID"
                name="EmployeeId"
                size="small"
                sx={{ m: 1, width: '25ch' }}
                value={employeeData?.EmployeeId || ''}
                onChange={this.handleInputChange}
              />
              <TextField
                label="First Name"
                name="FirstName"
                size="small"
                sx={{ m: 1, width: '25ch' }}
                value={employeeData?.FirstName || ''}
                onChange={this.handleInputChange}
              />
              <TextField
                label="Last Name"
                name="LastName"
                size="small"
                sx={{ m: 1, width: '25ch' }}
                value={employeeData?.LastName || ''}
                onChange={this.handleInputChange}
              />
            </div>
            <div>
            {user && user.IsSiteAdmin && (
              <TextField
                select
                label="Line Manager"
                name="LineManager"
                size="small"
                sx={{ m: 1, width: '25ch' }}
                value={isLineManagerDisabled ? 'No' : employeeData?.LineManager}
                onChange={this.handleInputChange}
                disabled={isLineManagerDisabled}
              >
                <MenuItem value="">Select Line Manager</MenuItem>
                {employeeData?.JobTitle !== 'Manager' ? (
                  null
                ) : (
                  <MenuItem value="No">No</MenuItem>
                )}
                {managerEmployees.map((employee) => (
                  <MenuItem key={employee.EmployeeId} value={`${employee.FirstName} ${employee.LastName}`}>
                    {`${employee.FirstName} ${employee.LastName}`}
                  </MenuItem>
                ))}
              </TextField>
            )}
            {user && !user.IsSiteAdmin && (
              <TextField
                select
                label="Line Manager"
                name="LineManager"
                size="small"
                sx={{ m: 1, width: '25ch' }}
                value={isLineManagerDisabled ? 'No' : employeeData?.LineManager || ''}
                onChange={this.handleInputChange}
                disabled
              >
                {employeeData?.JobTitle !== 'Manager' ? (
                  null
                ) : (
                  <MenuItem value="No">No</MenuItem>
                )}
                {managerEmployees.map((employee) => (
                  <MenuItem key={employee.EmployeeId} value={`${employee.FirstName} ${employee.LastName}`}>
                    {`${employee.FirstName} ${employee.LastName}`}
                  </MenuItem>
                ))}
              </TextField>
            )}
              <TextField
                label="Nationality"
                name="Nationality"
                size="small"
                sx={{ m: 1, width: '25ch' }}
                value={employeeData?.Nationality || ''}
                onChange={this.handleInputChange}
              />
              <TextField
                label="Date of Birth"
                name="DateOfBirth"
                size="small"
                sx={{ m: 1, width: '25ch' }}
                type="date"
                value={formattedDateOfBirth}
                onChange={this.handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div>
              <TextField
                select
                label="Gender"
                name="Gender"
                size="small"
                sx={{ m: 1, width: '25ch' }}
                value={employeeData?.Gender || ''}
                onChange={this.handleInputChange}
              >
                <MenuItem value="">Select Gender</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
              <TextField
                label="Phone Number"
                name="PhoneNumber"
                size="small"
                sx={{ m: 1, width: '25ch' }}
                type="number"
                value={employeeData?.PhoneNumber || ''}
                onChange={this.handleInputChange}
              />
              <TextField
                label="Secondary Phone Number"
                name="SecondaryPhoneNumber"
                size="small"
                sx={{ m: 1, width: '25ch' }}
                type="number"
                value={employeeData?.SecondaryPhoneNumber || ''}
                onChange={this.handleInputChange}
              />
            </div>
            <div>
              <TextField
                label="Personal Email"
                name="PersonalEmail"
                size="small"
                sx={{ m: 1, width: '25ch' }}
                type="email"
                value={employeeData?.PersonalEmail || ''}
                onChange={this.handleInputChange}
              />
               <TextField
                label="Professional Email"
                name="ProfessionalEmail"
                size="small"
                sx={{ m: 1, width: '25ch' }}
                type="email"
                value={employeeData?.ProfessionalEmail || ''}
                onChange={this.handleInputChange}
              />
              <TextField
              label="LinkedIn"
              name="Linkedin"
              size="small"
              sx={{ m: 1, width: '25ch' }}
              value={employeeData?.Linkedin || ''}
              onChange={this.handleInputChange}
            />
            </div>
            <div>
            <TextField
                label="Start Date"
                name="StartDate"
                size="small"
                sx={{ m: 1, width: '25ch' }}
                type="date"
                value={formattedStartDate}
                onChange={this.handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="End Date"
                name="EndDate"
                size="small"
                sx={{ m: 1, width: '25ch' }}
                type="date"
                value={formattedEndDate !== '' ? formattedEndDate : ''}
                onChange={this.handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Days Allowed"
                name="DaysAllowed"
                size="small"
                sx={{ m: 1, width: '25ch' }}
                type="number"
                value={employeeData?.DaysAllowed || ''}
                onChange={this.handleInputChange}
              />
            </div>
            <div>
            <TextField
                select
                label="Employment Type"
                name="EmploymentType"
                size="small"
                sx={{ m: 1, width: '25ch' }}
                value={employeeData?.JobTitle || ''}
                onChange={this.handleInputChange}
              >
                 <MenuItem value="Permanent">Permanent</MenuItem>
                 <MenuItem value="Intern">Intern</MenuItem>
                 <MenuItem value="Part-Time">Part-Time</MenuItem>
              </TextField>
              <TextField
                select
                label="Job Title"
                name="JobTitle"
                size="small"
                sx={{ m: 1, width: '25ch' }}
                value={employeeData?.JobTitle || ''}
                onChange={this.handleInputChange}
              >
                <MenuItem value="Software Engineer">Software Engineer</MenuItem>
                <MenuItem value="Software Developer">Software Developer</MenuItem>
                <MenuItem value="Full Stack Developer">Full Stack Developer</MenuItem>
                <MenuItem value="Front-End Developer">Front-End Developer</MenuItem>
                <MenuItem value="Back-End Developer">Back-End Developer</MenuItem>
                <MenuItem value="Mobile App Developer">Mobile App Developer</MenuItem>
                <MenuItem value="DevOps Engineer">DevOps Engineer</MenuItem>
                <MenuItem value="Data Engineer">Data Engineer</MenuItem>
                <MenuItem value="Machine Learning Engineer">Machine Learning Engineer</MenuItem>
                <MenuItem value="Embedded Systems Engineer">Embedded Systems Engineer</MenuItem>
                <MenuItem value="Security Engineer">Security Engineer</MenuItem>
                <MenuItem value="Cloud Engineer">Cloud Engineer</MenuItem>
                <MenuItem value="UI/UX Engineer">UI/UX Engineer</MenuItem>
                <MenuItem value="Integration Engineer">Integration Engineer</MenuItem>
                <MenuItem value="Test Engineer">Test Engineer</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Marketer">Marketer</MenuItem>
                <MenuItem value="PMO">PMO</MenuItem>
              </TextField>
              <FormControl sx={{ m: 1, width: '25ch' }} size="small">
                <InputLabel id="department1-label">Department</InputLabel>
                <Select
                  labelId="department1-label"
                  id="department1"
                  name="Department"
                  multiple
                  value={Array.isArray(employeeData?.Department) ? employeeData?.Department : []}
                  onChange={this.handleSelectChange}
                  input={<OutlinedInput label="Department" />}
                  renderValue={(selected: string[]) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="Engineering/Development">Engineering/Development</MenuItem>
                  <MenuItem value="Product Management">Product Management</MenuItem>
                  <MenuItem value="Design/UX/UI">Design/UX/UI</MenuItem>
                  <MenuItem value="Data/Analytics">Data/Analytics</MenuItem>
                  <MenuItem value="IT Operations/Infrastructure">IT Operations/Infrastructure</MenuItem>
                  <MenuItem value="Sales/Business Development">Sales/Business Development</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Human Resources">Human Resources</MenuItem>
                  <MenuItem value="Finance/Accounting">Finance/Accounting</MenuItem>
                </Select>
              </FormControl>
            </div>
            <Button variant="contained" size="small" sx={{ m: 1.5 }} style={{ color: "rgb(139, 161, 183)", backgroundColor: "rgb(11, 41, 72)" }} type="submit">Update</Button>
          </Box>
        </form>
      </div>
    );
  }
}


const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  updateEmployee: (employeeData: Employee) => {
    dispatch(editEmployeeSuccess()); // Dispatch the success action with the updated employee data
    getEmployees()
    .then(() => {
      dispatch(addEmployeeSuccess());
    })
    .catch((error: Error) => {
      dispatch(addEmployeeFailure(error.message)); 
    });

    editEmployee(employeeData)
      .then(() => {
        console.log('Employee updated successfully');
      })
      .catch((error) => {
        dispatch(editEmployeeFailure(error.message)); // Dispatch the failure action with the error message
        console.error('Failed to update employee:', error);
      });
  },
});

const connector = connect(null, mapDispatchToProps);
const EmployeeFormWithRouter = withRouter(UpdateEmployee);
export default connector(EmployeeFormWithRouter);
