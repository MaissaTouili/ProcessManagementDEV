import { ChangeEvent, Component, FormEvent } from 'react';
import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
//import { RootState } from '../../store/reducers/RootReducer';
import { addLeaveFailure, addLeaveRequest, addLeaveSuccess } from '../../store/actions/actions';
import { Box, Button, MenuItem, TextField, FormControl, FormHelperText } from '@mui/material';
import PageHeader from '../pageheader/Pageheader';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
//import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { RouteComponentProps, withRouter  } from 'react-router-dom';
import { SendLeaveRequest } from '../../services/LeaveService';

//import { endsWith } from 'lodash';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';

type PropsFromRouter = RouteComponentProps;
// Define the type for the component props
type PropsFromRedux = ConnectedProps<typeof connector>;


// Define the component state type
interface LeaveFormState {
    LeaveType: string;
    From: string;
    To: string;
    HalfDay: string;
    Reason: string;

    LeaveTypeError: string;
    FromError: string;
    ToError: string;
    HalfDayError: string;
    ReasonError: string;
}

// Combine the component props and state types
//type EmployeeFormProps = PropsFromRedux;
type LeaveFormProps = PropsFromRedux & PropsFromRouter& {
    user: SharePointUser;
  };

class LeaveRequest extends Component<LeaveFormProps, LeaveFormState> {

  constructor(props: LeaveFormProps) {
    super(props);

    this.state = {
      LeaveType: '',
      From: '',
      To: '',
      HalfDay: '',
      Reason: '',
  
      LeaveTypeError: '',
      FromError: '',
      ToError: '',
      HalfDayError: '',
      ReasonError: '',
    };
  }

  validateField = (fieldName: string, value: string): string => {
    let error = '';

    if (fieldName === 'LeaveType') {
      if (!value) {
        error = 'Leave Type is required';
      } 
    }
    
    if (fieldName === 'From') {
      if (!value) {
        error = 'startLeave Date is required';
      } 
    }

    if (fieldName === 'To') {
      if (!value) {
        error = 'endLeave Date is required';
      }

    }
    if (fieldName === 'HalfDay') {
      if (!value) {
        error = 'Half Day is required';
      } 
    }

    if (fieldName === 'Reason') {
      if (!value) {
        error = 'Reason is required';
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
        LeaveTypeError,
        FromError,
        ToError,
        HalfDayError,
        ReasonError,
    } = this.state;
  
    // Check if any of the error fields are not empty
    return (
        !LeaveTypeError &&
        !FromError &&
        !ToError &&
        !HalfDayError &&
        !ReasonError
    );
  };
  


  handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

     // Check if the form is valid
  if (!this.isValidForm()) {
    return;
  }
    const { addLeaveRequest, addLeaveSuccess, addLeaveFailure, user} = this.props;
    const { LeaveType, From, To, HalfDay,Reason } = this.state;

    try {
      addLeaveRequest(); // Dispatch the request action

      await SendLeaveRequest({
        LeaveType,
        From: new Date(From), // Convert the string to Date
        To: new Date(To),
        HalfDay,
        Reason,
      },
      user.Title
      ); // Call the addLeave service

      addLeaveSuccess(); // Dispatch the success action
 
      // Clear the form fields
      this.setState({
      LeaveType: '',
      From: '',
      To: '',
      HalfDay: '',
      Reason: '',
      });
    } catch (error) {
      addLeaveFailure((error as Error).message); // Dispatch the failure action
    }
  };

  handleInputChange = (e: ChangeEvent<{ name: string; value: unknown }>): void => {
    const { name, value } = e.target;
    const error = this.validateField(name, value as string);

    // Convert the value to the appropriate type based on the input name
    let convertedValue: string | Date = value as string;

    if (name === 'From' || name === 'To') {
      const date = new Date(value as string);
      convertedValue = date.toISOString().split('T')[0]; // Format as "yyyy-MM-dd"
    }
    
    this.setState((prevState) => ({
      ...prevState,
      [name]: convertedValue,
      [`${name}Error`]: error,
    }));
  };
  handleInputChangeForHalfDay = (e: ChangeEvent<{ name: string; value: unknown }>): void => {
    const { name, value } = e.target;
    const error = this.validateField(name, value as string);
  
    // Convert the value to the appropriate type based on the input name
    let convertedValue: string | Date = value as string;
  
    if (name === 'From' || name === 'To') {
      const fromDate = new Date(this.state.From);
      const toDate = new Date(this.state.To);
  
      // Calculate the difference in days between From and To dates
      const diffInDays = Math.floor((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
  
      if (diffInDays > 1) {
        convertedValue = 'No'; // Set Half Day to "No"
        this.setState({
          HalfDay: convertedValue, // Update HalfDay value in the state
        });
      }
    }
  
    this.setState((prevState) => ({
      ...prevState,
      [name]: convertedValue,
      [`${name}Error`]: error,
    }));
  };

  handleGoBack = (): void => {
    const { history } = this.props;
    history.goBack();
  };
  
  render(): JSX.Element {
    const { user } = this.props; // Get the user from props
    //disable condition
    const fromDate = new Date(this.state.From);
    const toDate = new Date(this.state.To);
    const diffInDays = Math.floor((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
    const isHalfDayDisabled = diffInDays > 1;

    return (
      <div>
        <ArrowBackOutlinedIcon onClick={this.handleGoBack} sx={{color: "rgb(139, 161, 183)"}}/>
        <PageHeader
          title="New Leave Request"
          subTitle={`Welcome ${user.Title}, you can apply for a leave request here!`}
          icon={<InsertDriveFileOutlinedIcon fontSize="large" style={{ color: "rgb(11, 41, 72)" }} />}
        />

        <form onSubmit={this.handleSubmit}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {/* Form fields */}
            <div>
              <FormControl sx={{ m: 1, width: '25ch' }} error={!!this.state.LeaveTypeError}>
                <TextField
                  select
                  label="Leave Type"
                  name="LeaveType"
                  size="small"
                  value={this.state.LeaveType}
                  onBlur={this.handleBlur}
                  onChange={this.handleInputChange}
                  >
                    <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                    <MenuItem value="Parent Leave">Parent Leave</MenuItem>
                    <MenuItem value="Annual Leave">Annual Leave</MenuItem>
                    <MenuItem value="Normal Leave">Normal Leave</MenuItem>
                  </TextField>
                <FormHelperText>{this.state.LeaveTypeError}</FormHelperText>
               </FormControl>
                <FormControl sx={{ m: 1, width: '25ch' }} error={!!this.state.HalfDayError}>
                <TextField
                  select
                  label="Half Day"
                  name="HalfDay"
                  size="small"
                  value={isHalfDayDisabled ? 'No' : this.state.HalfDay}
                  onBlur={this.handleBlur}
                  onChange={this.handleInputChangeForHalfDay}
                  disabled={isHalfDayDisabled}
                >
                  <MenuItem value="No">No</MenuItem>
                  <MenuItem value="First Half">First Half</MenuItem>
                  <MenuItem value="Second Half">Second Half</MenuItem>
                </TextField>
                <FormHelperText>{this.state.HalfDayError}</FormHelperText>
              </FormControl>
            </div>
            <div>
            <FormControl sx={{ m: 1, width: '25ch' }} error={!!this.state.FromError}>
                <TextField
                  label="From"
                  name="From"
                  size="small"
                  type="date"
                  value={this.state.From}
                  onBlur={this.handleBlur}
                  onChange={this.handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <FormHelperText>{this.state.FromError}</FormHelperText>
              </FormControl>
              <FormControl sx={{ m: 1, width: '25ch' }} error={!!this.state.ToError}>
                <TextField
                  label="To"
                  name="To"
                  size="small"
                  type="date"
                  value={this.state.To}
                  onBlur={this.handleBlur}
                  onChange={this.handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <FormHelperText>{this.state.ToError}</FormHelperText>
              </FormControl>
            </div>
            
            <div style={{display: "flex", flexDirection:"column", justifyContent: 'center', alignItems: 'center'}}>
              <FormControl sx={{ m: 1, width: '52ch' }} error={!!this.state.ReasonError}>
                <TextField
                  label="Reason"
                  name="Reason"
                  size="small"
                  multiline
                  rows={4}
                  fullWidth
                  value={this.state.Reason}
                  onBlur={this.handleBlur}
                  onChange={this.handleInputChange}
                />
                <FormHelperText>{this.state.ReasonError}</FormHelperText>
              </FormControl>
              <div>
              {/* <Button variant="contained" size="small" sx={{ m: 1.5 }} style={{ color: "white", backgroundColor: "red" }} type="submit" endIcon={<CancelOutlinedIcon style={{ color: "white" }} />}>Cancel</Button> */}
              <Button variant="contained" size="small" sx={{ m: 1.5 }} disabled={!this.isValidForm() || !this.state.LeaveType || !this.state.From|| !this.state.To || !this.state.Reason } //|| !this.state.HalfDay
              style={{ color: "rgb(139, 161, 183)", backgroundColor: "rgb(11, 41, 72)" }} type="submit" endIcon={<SendOutlinedIcon style={{ color: "rgb(89, 208, 255)" }} />}>Send</Button>
            </div>
            </div>
          </Box>
        </form>
      </div >
    );
  }
  
}


// Map the Redux actions to component props
const mapDispatchToProps = {
  addLeaveRequest,
  addLeaveSuccess,
  addLeaveFailure,
};

// Connect the component to Redux
const connector = connect(null, mapDispatchToProps);
export default connector(withRouter(LeaveRequest));

