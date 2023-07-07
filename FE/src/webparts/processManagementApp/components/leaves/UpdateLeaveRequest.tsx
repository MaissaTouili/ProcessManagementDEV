import { ChangeEvent, Component } from 'react';
import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
// import { RootState } from '../../store/reducers/RootReducer';
import { editLeaveFailure, editLeaveSuccess } from '../../store/actions/actions';
import { Box, Button, MenuItem, TextField, FormControl, CircularProgress } from '@mui/material';
import PageHeader from '../pageheader/Pageheader';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
//import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { RouteComponentProps, withRouter  } from 'react-router-dom';
import { editLeave, getLeavesById } from '../../services/LeaveService';
import { Dispatch } from 'redux';

//import { endsWith } from 'lodash';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
interface IUpdateLeaveProps {
    user: SharePointUser;
    Id: number;
    updateLeaveRequest: (leaveData: Leave) => void;
  }
interface DispatchProps {
    updateLeaveRequest: (leaveData: Leave) => void;
  }
type PropsFromRouter = RouteComponentProps;
// Define the type for the component props
type PropsFromRedux = ConnectedProps<typeof connector>  & IUpdateLeaveProps;


// Define the component state type
interface IUpdateLeaveFormState {
    leaveData: Leave | undefined;
    isLoading: boolean;
}

// Combine the component props and state types
//type EmployeeFormProps = PropsFromRedux;
type LeaveFormProps = PropsFromRedux & PropsFromRouter& {
    user: SharePointUser;
  };

class UpdateLeaveForm extends Component<LeaveFormProps, IUpdateLeaveFormState> {

  constructor(props: LeaveFormProps) {
    super(props);

    this.state = {
        leaveData: null,
        isLoading: true,
      };
  }
  public async componentDidMount(): Promise<void> {
    // const { employeeId } = this.props;
    await this.fetchLeaveData();
  }

  private fetchLeaveData = async (): Promise<void> => {
    const { Id } = this.props;
    try {
        const data = await getLeavesById(Id.toString());
        if (data) {
          this.setState({
            leaveData: data,
            isLoading: false,
          });
        } else {
          throw new Error('Leave request not found');
        }
      } catch (error) {
        throw new Error('Failed to fetch leave request data');
      }
  };
  private handleFormSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const { leaveData } = this.state;
    if (leaveData) {
        this.props.updateLeaveRequest(leaveData);
      }
      // Redirect to LeavesList page
      this.props.history.push('/leaves');
  };

    handleInputChange = (e: ChangeEvent<{ name: string; value: unknown }>): void => {
        const { name, value } = e.target;

        // Convert the value to the appropriate type based on the input name
        let convertedValue: string | Date = value as string;

        if (name === 'From' || name === 'To') {
            const date = new Date(value as string);
            convertedValue = date.toISOString().split('T')[0]; // Format as "yyyy-MM-dd"
        }

        this.setState((prevState) => ({
            leaveData: {
                ...prevState.leaveData,
                [name]: convertedValue,
            }

        }));
    };

  handleGoBack = (): void => {
    const { history } = this.props;
    history.goBack();
  };
  
  render(): JSX.Element {
    const { user } = this.props; // Get the user from props
    const { leaveData, isLoading } = this.state;

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress sx={{ color: "rgb(89, 208, 255)" }} />
        </div>
      }
    return (
      <div>
        <ArrowBackOutlinedIcon onClick={this.handleGoBack} sx={{color: "rgb(139, 161, 183)"}}/>
        <PageHeader
          title="Update Leave Request"
          subTitle={`Welcome ${user.Title}, you can edit your leave request here`}
          icon={<InsertDriveFileOutlinedIcon fontSize="large" style={{ color: "rgb(11, 41, 72)" }} />}
        />

        <form onSubmit={this.handleFormSubmit}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {/* Form fields */}
            <div>
              <FormControl sx={{ m: 1, width: '25ch' }}>
                <TextField
                  select
                  label="Leave Type"
                  name="LeaveType"
                  size="small"
                  value={leaveData?.LeaveType}
                  onChange={this.handleInputChange}
                  >
                  <MenuItem value="">Select Leave </MenuItem>
                    <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                    <MenuItem value="Parent Leave">Parent Leave</MenuItem>
                    <MenuItem value="Annual Leave">Annual Leave</MenuItem>
                    <MenuItem value="Normal Leave">Normal Leave</MenuItem>
                  </TextField>
              </FormControl>
              <FormControl sx={{ m: 1, width: '25ch' }}>
                <TextField
                  select
                  label="Half Day"
                  name="HalfDay"
                  size="small"
                  defaultValue="No"
                  value={leaveData?.HalfDay}
                  onChange={this.handleInputChange}
                >
                  <MenuItem value="">Select </MenuItem>
                  <MenuItem value="No">No</MenuItem>
                  <MenuItem value="First Half">First Half</MenuItem>
                  <MenuItem value="Second Half">Second Half</MenuItem>
                </TextField>
              </FormControl>
            </div>
            <div>
              <FormControl sx={{ m: 1, width: '25ch' }}>
                <TextField
                  label="To"
                  name="To"
                  size="small"
                  type="date"
                  value={leaveData?.To}
                  onChange={this.handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
            </div>
            
            <div style={{display: "flex", flexDirection:"column", justifyContent: 'center', alignItems: 'center'}}>
              <FormControl sx={{ m: 1, width: '52ch' }}>
                <TextField
                  label="Reason"
                  name="Reason"
                  size="small"
                  multiline
                  rows={4}
                  fullWidth
                  value={leaveData?.Reason}
                  onChange={this.handleInputChange}
                />
              </FormControl>
              <div>
              {/* <Button variant="contained" size="small" sx={{ m: 1.5 }} style={{ color: "white", backgroundColor: "red" }} type="submit" endIcon={<CancelOutlinedIcon style={{ color: "white" }} />}>Cancel</Button> */}
              <Button variant="contained" size="small" sx={{ m: 1.5 }} style={{ color: "rgb(139, 161, 183)", backgroundColor: "rgb(11, 41, 72)" }} type="submit"
               endIcon={<SendOutlinedIcon style={{ color: "rgb(89, 208, 255)" }} />}>Update</Button>
            </div>
            </div>
          </Box>
        </form>
      </div >
    );
  }
}

// Map the Redux actions to component props
const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    updateLeaveRequest: (leaveData: Leave) => {
      dispatch(editLeaveSuccess()); // Dispatch the success action with the updated employee data
  
      editLeave(leaveData)
        .then(() => {
          console.log('Leave request updated successfully');
        })
        .catch((error: Error) => {
          dispatch(editLeaveFailure(error.message)); // Dispatch the failure action with the error message
          console.error('Failed to update leave request:', error);
        });
    },
  });

// Connect the component to Redux
const connector = connect(null, mapDispatchToProps);
const LeaveFormWithRouter = withRouter(UpdateLeaveForm);
export default connector(LeaveFormWithRouter);

