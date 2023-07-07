import { ChangeEvent, Component, FormEvent } from 'react';
import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { addEmployee, getEmployees } from '../../services/EmployeeService';
//import { RootState } from '../../store/reducers/RootReducer';
import { addEmployeeRequest, addEmployeeSuccess, addEmployeeFailure } from '../../store/actions/actions';
import { Box, Button, MenuItem, TextField, FormControl, FormHelperText, Chip, Select, InputLabel, SelectChangeEvent, OutlinedInput } from '@mui/material';
import PageHeader from '../pageheader/Pageheader';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';

//import { endsWith } from 'lodash';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
type DispatchProps = {
  addEmployee: (employeeData: Employee) => void;
  // Define other action creators as needed
};
type PropsFromRouter = RouteComponentProps;
// Define the type for the component props
type PropsFromRedux = ConnectedProps<typeof connector>;


// Define the component state type
interface EmployeeFormState {
  EmployeeId: string;
  FirstName: string;
  LastName: string;
  LineManager: string;
  Nationality: string;
  DateOfBirth: string;
  Gender: string;
  PhoneNumber: number;
  SecondaryPhoneNumber: number;
  PersonalEmail: string;
  ProfessionalEmail: string;
  Linkedin: string;
  StartDate: string;
  EndDate: string;
  DaysAllowed: number;
  EmploymentType: string;
  JobTitle: string;
  Department: string[];

  EmployeeIdError: string;
  FirstNameError: string;
  LastNameError: string;
  LineManagerError: string;
  NationalityError: string;
  DateOfBirthError: string;
  GenderError: string;
  PhoneNumberError: string;
  SecondaryPhoneNumberError: string;
  PersonalEmailError: string;
  ProfessionalEmailError: string;
  LinkedinError: string;
  StartDateError: string;
  EndDateError: string;
  DaysAllowedError: string;
  EmploymentTypeError: string;
  JobTitleError: string;
  DepartmentError: string;

  employees: Employee[];
}

// Combine the component props and state types
//type EmployeeFormProps = PropsFromRedux;
type EmployeeFormProps = PropsFromRedux & PropsFromRouter & {
  user: SharePointUser;
};

class EmployeeForm extends Component<EmployeeFormProps, EmployeeFormState, PropsFromRouter> {

  constructor(props: EmployeeFormProps) {
    super(props);

    this.state = {
      EmployeeId: '',
      FirstName: '',
      LastName: '',
      LineManager: '',
      Nationality: '',
      DateOfBirth: '',
      Gender: '',
      PhoneNumber: null,
      SecondaryPhoneNumber: null,
      PersonalEmail: '',
      ProfessionalEmail: '',
      Linkedin: '',
      StartDate: '',
      EndDate: '',
      DaysAllowed: null,
      EmploymentType: '',
      JobTitle: '',
      Department: [],

      EmployeeIdError: '',
      FirstNameError: '',
      LastNameError: '',
      LineManagerError: '',
      NationalityError: '',
      DateOfBirthError: '',
      GenderError: '',
      PhoneNumberError: '',
      SecondaryPhoneNumberError: '',
      PersonalEmailError: '',
      ProfessionalEmailError: '',
      LinkedinError: '',
      StartDateError: '',
      EndDateError: '',
      DaysAllowedError: '',
      EmploymentTypeError: '',
      JobTitleError: '',
      DepartmentError: '',

      employees: [],
    };
  }

  async componentDidMount(): Promise<void> {
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

  validateField = (fieldName: string, value: string): string => {
    let error = '';

    if (fieldName === 'EmployeeId') {
      if (!value) {
        error = 'Employee ID is required';
      }
    }

    if (fieldName === 'FirstName') {
      if (!value) {
        error = 'First Name is required';
      } else if (!/^[A-Za-z]+$/.test(value)) {
        error = 'First Name must only contain letters';
      } else if (value.charAt(0) !== value.charAt(0).toUpperCase()) {
        error = 'First letter must be an uppercase';
      }

    }
    if (fieldName === 'LastName') {
      if (!value) {
        error = 'Last Name is required';
      } else if (!/^[A-Za-z]+$/.test(value)) {
        error = 'Last Name must only contain letters';
      } else if (value.charAt(0) !== value.charAt(0).toUpperCase()) {
        error = 'First letter must be an uppercase';
      }
    }

    if (fieldName === 'LineManager') {
      if (!value) {
        error = 'Line Manager is required';
      }
    }

    if (fieldName === 'Nationality') {
      if (!value) {
        error = 'Nationality is required';
      } else if (!/^[A-Za-z]+$/.test(value)) {
        error = 'Nationality must only contain letters';
      } else if (value.charAt(0) !== value.charAt(0).toUpperCase()) {
        error = 'First letter must be an uppercase';
      }

    }
    if (fieldName === 'DateOfBirth') {
      if (!value) {
        error = 'Date Of Birth is required';
      } else {
        const inputDate = new Date(value.split('T')[0]);
        const minimumDate = new Date('2004/01/01');

        if (inputDate > minimumDate) {
          error = 'The employee must be 19 years old or older';
        }
      }

    }
    if (fieldName === 'Gender') {
      if (!value) {
        error = 'Gender is required';
      }

    }
    if (fieldName === 'PhoneNumber') {
      if (!value) {
        error = 'Phone Number is required';
      } else if (value.length < 8) {
        error = 'Phone Number must have 8 numbers';
      }

    }
    if (fieldName === 'SecondaryPhoneNumber') {
      if (!value) {
        error = 'Secondary Phone Number is required';
      } else if (value.length < 8) {
        error = 'Secondary Phone Number must have 8 numbers';
      }

    }
    if (fieldName === 'PersonalEmail') {
      if (!value) {
        error = 'Personal Email is required';
      } else if (!/^[A-Za-z]/.test(value)) {
        error = 'Personal Email must start with letters';
      } else if (!/^([A-Za-z0-9._-]+)@([gmail|yahoo]+)\.([com]+)$/.test(value)) {
        error = 'Personal Email must end with @gmail.com or @yahoo.com';
      }

    }
    if (fieldName === 'ProfessionalEmail') {
      if (!value) {
        error = 'Professional Email is required';
      } else if (!/^[A-Za-z]/.test(value)) {
        error = 'Professional Email must start with letters';
      } else if (!/^([A-Za-z0-9._-]+)@([datahorizon]+)\.([eu]+)$/.test(value)) {
        error = 'Professional Email must end with @datahorizon.eu';
      }

    }
    if (fieldName === 'Linkedin') {
      if (!value) {
        error = 'Linkedin is required';
      }

    }

    if (fieldName === 'StartDate') {
      if (!value) {
        error = 'Start Date is required';
      }

    }
    if (fieldName === 'EndDate') {
      if (!value) {
        error = 'End Date is required';
      }
    }
    if (fieldName === 'DaysAllowed') {
      if (!value) {
        error = 'Days Allowed is required';
      }
    }

    if (fieldName === 'EmploymentType') {
      if (!value) {
        error = 'Employment Type is required';
      }

    }

    if (fieldName === 'JobTitle') {
      if (!value) {
        error = 'Job Title is required';
      }

    }
    if (fieldName === 'Department') {
      if (!value) {
        error = 'Department is required';
      }

    }

    return error;
  };

  handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    const error = this.validateField(name, value);

    this.setState((prevState) => ({
      ...prevState,
      [`${name}Error`]: error,
    }));
  };

  isValidForm = (): boolean => {
    const {
      EmployeeIdError,
      FirstNameError,
      LastNameError,
      LineManagerError,
      NationalityError,
      DateOfBirthError,
      GenderError,
      PhoneNumberError,
      SecondaryPhoneNumberError,
      PersonalEmailError,
      ProfessionalEmailError,
      LinkedinError,
      StartDateError,
      EndDateError,
      DaysAllowedError,
      EmploymentTypeError,
      JobTitleError,
      DepartmentError,
    } = this.state;

    // Check if any of the error fields are not empty
    return (
      !EmployeeIdError &&
      !FirstNameError &&
      !LastNameError &&
      !LineManagerError &&
      !NationalityError &&
      !DateOfBirthError &&
      !GenderError &&
      !PhoneNumberError &&
      !SecondaryPhoneNumberError &&
      !PersonalEmailError &&
      !ProfessionalEmailError &&
      !LinkedinError &&
      !StartDateError &&
      !EndDateError &&
      !DaysAllowedError &&
      !EmploymentTypeError &&
      !JobTitleError &&
      !DepartmentError
    );
  };



  handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Check if the form is valid
    if (!this.isValidForm()) {
      return;
    }
    // const { addEmployeeRequest, addEmployeeSuccess, addEmployeeFailure } = this.props;
    const { EmployeeId, FirstName, LastName, LineManager, Nationality, DateOfBirth, Gender, PhoneNumber, SecondaryPhoneNumber, PersonalEmail, ProfessionalEmail, Linkedin, StartDate, EndDate, JobTitle, DaysAllowed, EmploymentType, Department } = this.state;

    try {
      addEmployeeRequest(); // Dispatch the request action

      await addEmployee({
        EmployeeId,
        FirstName,
        LastName,
        LineManager,
        Nationality,
        DateOfBirth: new Date(DateOfBirth), // Convert the string to Date
        Gender,
        PhoneNumber,
        SecondaryPhoneNumber,
        PersonalEmail,
        ProfessionalEmail,
        Linkedin,
        StartDate: new Date(StartDate),
        EndDate: new Date(EndDate),
        DaysAllowed,
        EmploymentType,
        JobTitle,
        Department,
      }); // Call the addEmployee service

      addEmployeeSuccess(); // Dispatch the success action

      // Redirect to LeavesList page
      this.props.history.push('/employees');
      // Clear the form fields
      this.setState({
        EmployeeId: '',
        FirstName: '',
        LastName: '',
        LineManager: '',
        Nationality: '',
        DateOfBirth: '',
        Gender: '',
        PhoneNumber: null,
        SecondaryPhoneNumber: null,
        PersonalEmail: '',
        ProfessionalEmail: '',
        Linkedin: '',
        StartDate: '',
        EndDate: '',
        DaysAllowed: null,
        EmploymentType: '',
        JobTitle: '',
        Department: [],
      });
    } catch (error) {
      addEmployeeFailure((error as Error).message); // Dispatch the failure action
    }
    // Redirect to employeesList page
    this.props.history.push('/employees');
  };


  handleInputChange = (e: ChangeEvent<{ name: string; value: unknown }>): void => {
    const { name, value } = e.target;
    const error = this.validateField(name, value as string);

    // Convert the value to the appropriate type based on the input name
    let convertedValue: string | Date = value as string;

    const dateFields = ['DateOfBirth', 'StartDate', 'EndDate'];
    if (dateFields.indexOf(name) !== -1) {
      const date = new Date(value as string);
      convertedValue = date.toISOString().split('T')[0]; // Format as "yyyy-MM-dd"
    }

    this.setState((prevState) => ({
      ...prevState,
      [name]: convertedValue,
      [`${name}Error`]: error,
    }));
  };
  handleSelectChange = (event: SelectChangeEvent<string[]>): void => {
    const { name, value } = event.target;
    const updatedState = {
      ...this.state,
      [name]: value,
    } as EmployeeFormState;

    this.setState(updatedState);
  };
  handleJobTitleChange = (event: ChangeEvent<{ name: string; value: string }>): void => {
    const { value } = event.target;
    if (value === 'Manager') {
      this.setState({
        JobTitle: value,
        LineManager: 'No',
        LineManagerError: '',
      });
    } else {
      this.setState({
        JobTitle: value,
        LineManager: '',
        LineManagerError: '',
      });
    }
  };

  handleGoBack = (): void => {
    const { history } = this.props;
    history.goBack();
  };

  render(): JSX.Element {
    const { employees } = this.state;
    const { user } = this.props
    const managerEmployees = employees.filter(
      (employee) => employee.JobTitle === 'Manager'
    );
    const isLineManagerDisabled = this.state.JobTitle === 'Manager';
    const filterDepartmentViaManager = employees.filter(
      (employee) => employee.JobTitle === 'Manager' && `${employee.FirstName} ${employee.LastName}` === user.Title
    )

    return (
      <div>
        <ArrowBackOutlinedIcon onClick={this.handleGoBack} sx={{ color: "rgb(139, 161, 183)" }} />
        <PageHeader
          title="New Employee"
          subTitle="Add a new employee to the organization"
          icon={<GroupsOutlinedIcon fontSize="large" style={{ color: "rgb(11, 41, 72)" }} />}
        />
        <div>
          {user && (
            <>
              {employees.map((employee) => { //Manager
                if (employee.JobTitle === "Manager" && user.Title === `${employee.FirstName} ${employee.LastName}`) {
                  return (
                    <form onSubmit={this.handleSubmit}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                        {/* Form fields */}
                        <div>
                          <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.EmployeeIdError}>
                            <TextField
                              label="Employee ID"
                              name="EmployeeId"
                              size="small"
                              value={this.state.EmployeeId}
                              onBlur={this.handleBlur}
                              onChange={this.handleInputChange}
                            />
                            <FormHelperText>{this.state.EmployeeIdError}</FormHelperText>
                          </FormControl>
                          <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.FirstNameError}>
                            <TextField
                              label="First Name"
                              name="FirstName"
                              size="small"
                              value={this.state.FirstName}
                              onBlur={this.handleBlur}
                              onChange={this.handleInputChange}
                            />
                            <FormHelperText>{this.state.FirstNameError}</FormHelperText>
                          </FormControl>
                          <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.LastNameError}>
                            <TextField
                              label="Last Name"
                              name="LastName"
                              size="small"
                              value={this.state.LastName}
                              onBlur={this.handleBlur}
                              onChange={this.handleInputChange}
                            />
                            <FormHelperText>{this.state.LastNameError}</FormHelperText>
                          </FormControl>
                        </div>
                        <div>
                          <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.LineManagerError}>
                            <TextField
                              select
                              label="Line Manager"
                              name="LineManager"
                              size="small"
                              value={isLineManagerDisabled ? 'No' : this.state.LineManager}
                              onBlur={this.handleBlur}
                              onChange={this.handleInputChange}
                              disabled={isLineManagerDisabled}
                            >
                              <MenuItem value="">Select Line Manager</MenuItem>
                              {this.state.JobTitle !== 'Manager' ? (
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
                            <FormHelperText>{this.state.LineManagerError}</FormHelperText>
                          </FormControl>
                          <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.NationalityError}>
                            <TextField
                              label="Nationality"
                              name="Nationality"
                              size="small"
                              value={this.state.Nationality}
                              onBlur={this.handleBlur}
                              onChange={this.handleInputChange}
                            />
                            <FormHelperText>{this.state.NationalityError}</FormHelperText>
                          </FormControl>
                          <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.DateOfBirthError}>
                            <TextField
                              label="Date of Birth"
                              name="DateOfBirth"
                              size="small"
                              type="date"
                              value={this.state.DateOfBirth}
                              onBlur={this.handleBlur}
                              onChange={this.handleInputChange}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                            <FormHelperText>{this.state.DateOfBirthError}</FormHelperText>
                          </FormControl>
                        </div>
                        <div>
                          <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.GenderError}>
                            <TextField
                              select
                              label="Gender"
                              name="Gender"
                              size="small"
                              value={this.state.Gender}
                              onBlur={this.handleBlur}
                              onChange={this.handleInputChange}
                            >
                              <MenuItem value="">Select Gender</MenuItem>
                              <MenuItem value="Male">Male</MenuItem>
                              <MenuItem value="Female">Female</MenuItem>
                            </TextField>
                            <FormHelperText>{this.state.GenderError}</FormHelperText>
                          </FormControl>
                          <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.PhoneNumberError}>
                            <TextField
                              label="Phone Number"
                              name="PhoneNumber"
                              size="small"
                              type="number"
                              value={this.state.PhoneNumber}
                              onBlur={this.handleBlur}
                              onChange={this.handleInputChange}
                            />
                            <FormHelperText>{this.state.PhoneNumberError}</FormHelperText>
                          </FormControl>
                          <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.SecondaryPhoneNumberError}>
                            <TextField
                              label="Secondary Phone Number"
                              name="SecondaryPhoneNumber"
                              size="small"
                              type="number"
                              value={this.state.SecondaryPhoneNumber}
                              onBlur={this.handleBlur}
                              onChange={this.handleInputChange}
                            />
                            <FormHelperText>{this.state.SecondaryPhoneNumberError}</FormHelperText>
                          </FormControl>
                        </div>
                        <div>
                          <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.PersonalEmailError}>
                            <TextField
                              label="Personal Email"
                              name="PersonalEmail"
                              size="small"
                              type="email"
                              value={this.state.PersonalEmail}
                              onBlur={this.handleBlur}
                              onChange={this.handleInputChange}
                            />
                            <FormHelperText>{this.state.PersonalEmailError}</FormHelperText>
                          </FormControl>
                          <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.ProfessionalEmailError}>
                            <TextField
                              label="Professional Email"
                              name="ProfessionalEmail"
                              size="small"
                              type="email"
                              value={this.state.ProfessionalEmail}
                              onBlur={this.handleBlur}
                              onChange={this.handleInputChange}
                            />
                            <FormHelperText>{this.state.ProfessionalEmailError}</FormHelperText>
                          </FormControl>
                          <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.LinkedinError}>
                            <TextField
                              label="LinkedIn"
                              name="Linkedin"
                              size="small"
                              value={this.state.Linkedin}
                              onBlur={this.handleBlur}
                              onChange={this.handleInputChange}
                            />
                            <FormHelperText>{this.state.LinkedinError}</FormHelperText>
                          </FormControl>
                        </div>
                        <div>
                          <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.StartDateError}>
                            <TextField
                              label="Start Date"
                              name="StartDate"
                              size="small"
                              type="date"
                              value={this.state.StartDate}
                              onBlur={this.handleBlur}
                              onChange={this.handleInputChange}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                            <FormHelperText>{this.state.StartDateError}</FormHelperText>
                          </FormControl>
                          <FormControl sx={{ m: 1, width: '21ch' }}>
                            <TextField
                              label="End Date"
                              name="EndDate"
                              size="small"
                              type="date"
                              value={this.state.EndDate}
                              onBlur={this.handleBlur}
                              onChange={this.handleInputChange}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                            {/* <FormHelperText>{this.state.EndDateError}</FormHelperText> */}
                          </FormControl>
                          <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.DaysAllowedError}>
                            <TextField
                              label="Days Allowed"
                              name="DaysAllowed"
                              size="small"
                              type="number"
                              value={this.state.DaysAllowed}
                              onBlur={this.handleBlur}
                              onChange={this.handleInputChange}
                            />
                            <FormHelperText>{this.state.DaysAllowedError}</FormHelperText>
                          </FormControl>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                          <div>
                            <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.EmploymentTypeError}>
                              <TextField
                                select
                                label="Employment Type"
                                name="EmploymentType"
                                size="small"
                                value={this.state.EmploymentType}
                                onBlur={this.handleBlur}
                                onChange={this.handleInputChange}
                              >
                                <MenuItem value="Permanent">Permanent</MenuItem>
                                <MenuItem value="Intern">Intern</MenuItem>
                              </TextField>
                              <FormHelperText>{this.state.EmploymentTypeError}</FormHelperText>
                            </FormControl>
                            <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.JobTitleError}>
                              <TextField
                                select
                                label="Job Title"
                                name="JobTitle"
                                size="small"
                                value={this.state.JobTitle}
                                onBlur={this.handleBlur}
                                onChange={this.handleJobTitleChange}
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
                              <FormHelperText>{this.state.JobTitleError}</FormHelperText>
                            </FormControl>
                            <FormControl sx={{ m: 1, width: '21ch' }} size="small" error={!!this.state.DepartmentError}>
                              <InputLabel id="department-label">Department</InputLabel>
                              <Select
                                labelId="department-label"
                                id="department"
                                name="Department"
                                multiple
                                value={Array.isArray(this.state.Department) ? this.state.Department : []}
                                onBlur={this.handleBlur}
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
                                {filterDepartmentViaManager.map((employee) =>
                                  employee.Department.map((department) => (
                                    <MenuItem key={`${employee.EmployeeId}-${department}`} value={department}>
                                      {department}
                                    </MenuItem>
                                  ))
                                )}
                              </Select>
                              <FormHelperText>{this.state.DepartmentError}</FormHelperText>
                            </FormControl>
                          </div>
                          <Button variant="contained" size="small" disabled={!this.isValidForm() || !this.state.EmployeeId || !this.state.FirstName ||
                            !this.state.LastName || !this.state.LineManager || !this.state.Nationality || !this.state.DateOfBirth || !this.state.Gender || !this.state.PhoneNumber || !this.state.SecondaryPhoneNumber ||
                            !this.state.ProfessionalEmail || !this.state.PersonalEmail || !this.state.Linkedin || !this.state.StartDate|| !this.state.DaysAllowed|| !this.state.EmploymentType|| !this.state.JobTitle || !this.state.Department}
                            style={{ color: "rgb(139, 161, 183)", backgroundColor: "rgb(11, 41, 72)", maxWidth: "50px" }} type="submit">Create</Button>
                        </div>
                      </Box>
                    </form>
                  )
                }
              })}

              {user.IsSiteAdmin && !employees.some((employee) => employee.JobTitle === "Manager" && user.Title === `${employee.FirstName} ${employee.LastName}`) && (// only Admin
                <form onSubmit={this.handleSubmit}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                    {/* Form fields */}
                    <div>
                      <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.EmployeeIdError}>
                        <TextField
                          label="Employee ID"
                          name="EmployeeId"
                          size="small"
                          value={this.state.EmployeeId}
                          onBlur={this.handleBlur}
                          onChange={this.handleInputChange}
                        />
                        <FormHelperText>{this.state.EmployeeIdError}</FormHelperText>
                      </FormControl>
                      <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.FirstNameError}>
                        <TextField
                          label="First Name"
                          name="FirstName"
                          size="small"
                          value={this.state.FirstName}
                          onBlur={this.handleBlur}
                          onChange={this.handleInputChange}
                        />
                        <FormHelperText>{this.state.FirstNameError}</FormHelperText>
                      </FormControl>
                      <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.LastNameError}>
                        <TextField
                          label="Last Name"
                          name="LastName"
                          size="small"
                          value={this.state.LastName}
                          onBlur={this.handleBlur}
                          onChange={this.handleInputChange}
                        />
                        <FormHelperText>{this.state.LastNameError}</FormHelperText>
                      </FormControl>
                    </div>
                    <div>
                      <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.LineManagerError}>
                        <TextField
                          select
                          label="Line Manager"
                          name="LineManager"
                          size="small"
                          value={isLineManagerDisabled ? 'No' : this.state.LineManager}
                          onBlur={this.handleBlur}
                          onChange={this.handleInputChange}
                          disabled={isLineManagerDisabled}
                        >
                          <MenuItem value="">Select Line Manager</MenuItem>
                          {this.state.JobTitle !== 'Manager' ? (
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
                        <FormHelperText>{this.state.LineManagerError}</FormHelperText>
                      </FormControl>
                      <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.NationalityError}>
                        <TextField
                          label="Nationality"
                          name="Nationality"
                          size="small"
                          value={this.state.Nationality}
                          onBlur={this.handleBlur}
                          onChange={this.handleInputChange}
                        />
                        <FormHelperText>{this.state.NationalityError}</FormHelperText>
                      </FormControl>
                      <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.DateOfBirthError}>
                        <TextField
                          label="Date of Birth"
                          name="DateOfBirth"
                          size="small"
                          type="date"
                          value={this.state.DateOfBirth}
                          onBlur={this.handleBlur}
                          onChange={this.handleInputChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                        <FormHelperText>{this.state.DateOfBirthError}</FormHelperText>
                      </FormControl>
                    </div>
                    <div>
                      <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.GenderError}>
                        <TextField
                          select
                          label="Gender"
                          name="Gender"
                          size="small"
                          value={this.state.Gender}
                          onBlur={this.handleBlur}
                          onChange={this.handleInputChange}
                        >
                          <MenuItem value="">Select Gender</MenuItem>
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                        </TextField>
                        <FormHelperText>{this.state.GenderError}</FormHelperText>
                      </FormControl>
                      <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.PhoneNumberError}>
                        <TextField
                          label="Phone Number"
                          name="PhoneNumber"
                          size="small"
                          type="number"
                          value={this.state.PhoneNumber}
                          onBlur={this.handleBlur}
                          onChange={this.handleInputChange}
                        />
                        <FormHelperText>{this.state.PhoneNumberError}</FormHelperText>
                      </FormControl>
                      <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.SecondaryPhoneNumberError}>
                        <TextField
                          label="Secondary Phone Number"
                          name="SecondaryPhoneNumber"
                          size="small"
                          type="number"
                          value={this.state.SecondaryPhoneNumber}
                          onBlur={this.handleBlur}
                          onChange={this.handleInputChange}
                        />
                        <FormHelperText>{this.state.SecondaryPhoneNumberError}</FormHelperText>
                      </FormControl>
                    </div>
                    <div>
                      <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.PersonalEmailError}>
                        <TextField
                          label="Personal Email"
                          name="PersonalEmail"
                          size="small"
                          type="email"
                          value={this.state.PersonalEmail}
                          onBlur={this.handleBlur}
                          onChange={this.handleInputChange}
                        />
                        <FormHelperText>{this.state.PersonalEmailError}</FormHelperText>
                      </FormControl>
                      <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.ProfessionalEmailError}>
                        <TextField
                          label="Professional Email"
                          name="ProfessionalEmail"
                          size="small"
                          type="email"
                          value={this.state.ProfessionalEmail}
                          onBlur={this.handleBlur}
                          onChange={this.handleInputChange}
                        />
                        <FormHelperText>{this.state.ProfessionalEmailError}</FormHelperText>
                      </FormControl>
                      <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.LinkedinError}>
                        <TextField
                          label="LinkedIn"
                          name="Linkedin"
                          size="small"
                          value={this.state.Linkedin}
                          onBlur={this.handleBlur}
                          onChange={this.handleInputChange}
                        />
                        <FormHelperText>{this.state.LinkedinError}</FormHelperText>
                      </FormControl>
                    </div>
                    <div>
                      <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.StartDateError}>
                        <TextField
                          label="Start Date"
                          name="StartDate"
                          size="small"
                          type="date"
                          value={this.state.StartDate}
                          onBlur={this.handleBlur}
                          onChange={this.handleInputChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                        <FormHelperText>{this.state.StartDateError}</FormHelperText>
                      </FormControl>
                      <FormControl sx={{ m: 1, width: '21ch' }}>
                        <TextField
                          label="End Date"
                          name="EndDate"
                          size="small"
                          type="date"
                          value={this.state.EndDate}
                          onBlur={this.handleBlur}
                          onChange={this.handleInputChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                        {/* <FormHelperText>{this.state.EndDateError}</FormHelperText> */}
                      </FormControl>
                      <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.DaysAllowedError}>
                        <TextField
                          label="Days Allowed"
                          name="DaysAllowed"
                          size="small"
                          type="number"
                          value={this.state.DaysAllowed}
                          onBlur={this.handleBlur}
                          onChange={this.handleInputChange}
                        />
                        <FormHelperText>{this.state.DaysAllowedError}</FormHelperText>
                      </FormControl>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                      <div>
                        <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.EmploymentTypeError}>
                          <TextField
                            select
                            label="Employment Type"
                            name="EmploymentType"
                            size="small"
                            value={this.state.EmploymentType}
                            onBlur={this.handleBlur}
                            onChange={this.handleJobTitleChange}
                          >
                            <MenuItem value="Permanent">Permanent</MenuItem>
                            <MenuItem value="Intern">Intern</MenuItem>

                          </TextField>
                          <FormHelperText>{this.state.EmploymentTypeError}</FormHelperText>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '21ch' }} error={!!this.state.JobTitleError}>
                          <TextField
                            select
                            label="Job Title"
                            name="JobTitle"
                            size="small"
                            value={this.state.JobTitle}
                            onBlur={this.handleBlur}
                            onChange={this.handleJobTitleChange}
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
                          <FormHelperText>{this.state.JobTitleError}</FormHelperText>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '21ch' }} size="small" error={!!this.state.DepartmentError}>
                          <InputLabel id="department-label">Department</InputLabel>
                          <Select
                            labelId="department-label"
                            id="department"
                            name="Department"
                            multiple
                            value={Array.isArray(this.state.Department) ? this.state.Department : []}
                            onBlur={this.handleBlur}
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
                          <FormHelperText>{this.state.DepartmentError}</FormHelperText>
                        </FormControl>
                      </div>
                      <Button variant="contained" size="small" disabled={!this.isValidForm() || !this.state.EmployeeId || !this.state.FirstName ||
                        !this.state.LastName || !this.state.LineManager || !this.state.Nationality || !this.state.DateOfBirth || !this.state.Gender || !this.state.PhoneNumber || !this.state.SecondaryPhoneNumber ||
                        !this.state.PersonalEmail || !this.state.Linkedin || !this.state.StartDate || !this.state.JobTitle || !this.state.Department}
                        style={{ color: "rgb(139, 161, 183)", backgroundColor: "rgb(11, 41, 72)", maxWidth: "50px" }} type="submit">Create</Button>
                    </div>
                  </Box>
                </form>
              )}
            </>
          )}
        </div>
      </div >
    );
  }
}


// Map the Redux actions to component props
const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  addEmployee: (employeeData: Employee) => {
    dispatch(addEmployeeSuccess()); // Dispatch the success action with the updated employee data
    getEmployees()
      .then(() => {
        dispatch(addEmployeeSuccess());
      })
      .catch((error: Error) => {
        dispatch(addEmployeeFailure(error.message)); // Dispatch the failure action with the error message
        console.error('Failed to add employee:', error);
      });

    addEmployee(employeeData)
      .then(() => {
        console.log('Employee added successfully');
      })
      .catch((error) => {
        dispatch(addEmployeeFailure(error.message)); // Dispatch the failure action with the error message
        console.error('Failed to update employee:', error);
      });

  },

});

// Connect the component to Redux
const connector = connect(null, mapDispatchToProps);
const EmployeeFormWithRouter = withRouter(EmployeeForm);
export default connector(EmployeeFormWithRouter);

