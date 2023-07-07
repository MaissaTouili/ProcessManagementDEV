import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { getEmployees } from '../../services/EmployeeService';
import { RootState } from '../../store/reducers/RootReducer';
import { getEmployeesFailure, getEmployeesSuccess, getEmployeesRequest } from '../../store/actions/actions';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import PageHeader from '../pageheader/Pageheader';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { Avatar, AvatarGroup, Button, Card, CardContent, CardHeader, Divider, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface IDepartmentsListProps extends RouteComponentProps {
  employees: Employee[];
  fetchEmployees: () => void;
  user: SharePointUser;
}
type DispatchProps = {
  fetchEmployees: () => void;
  // Define other action creators as needed
};
type StateProps = {
  employees: Employee[]
}
interface IDepartmentsListState {

}



class DepartmentsList extends React.Component<IDepartmentsListProps, IDepartmentsListState> {
  //navigate: any;

  constructor(props: IDepartmentsListProps) {
    super(props);
    this.state = {};
  }

  public componentDidMount(): void {
    this.props.fetchEmployees();
  }

  handleGoBack = (): void => {
    const { history } = this.props;
    history.goBack();
  };

  stringToColor = (string: string): string => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    const blue = hash & 0xff;
    const lightness = 50 + ((hash >> 8) % 40); // Adjust lightness between 50 and 89

    const color = `hsl(210, 100%, ${lightness}%, ${blue})`;

    /* eslint-enable no-bitwise */

    if (blue === 0) {
      return 'rgb(11, 41, 72)';
    }

    return color;
  };




  stringAvatar = (name: string): { sx: { bgcolor: string }; children: string } => {
    const nameParts = name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1].trim();

    let children = '';
    if (firstName) {
      children += firstName[0];
    }
    if (lastName && lastName.length > 0) {
      children += lastName[0];

    }

    return {
      sx: {
        bgcolor: this.stringToColor(name),
      },
      children: children,
    };
  };

  public render(): JSX.Element {
    const { user, employees } = this.props;
    const departmentMap: { [key: string]: Employee[] } = {};

    // Group employees by department
    employees.forEach((employee) => {
      employee.Department.forEach((department) => {
        if (departmentMap[department]) {
          departmentMap[department].push(employee);
        } else {
          departmentMap[department] = [employee];
        }
      });
    });
    const departmentEntries = Object.keys(departmentMap).map((key) => [key, departmentMap[key]]);
    return (
      <div>
        <ArrowBackOutlinedIcon onClick={this.handleGoBack} sx={{ color: "rgb(139, 161, 183)" }} />
        <PageHeader
          title="Departments"
          subTitle={`Welcome ${user.Title}, you can find all the departments here!`}
          icon={<BallotOutlinedIcon fontSize="large" style={{ color: "rgb(11, 41, 72)" }} />}
        />
        <Grid container spacing={2}>
          {departmentEntries.map(([department, employees], index) => (
            <Grid item xs={12} sm={6} md={6} key={`${department}_${index}`}>
              <Card>
                <CardHeader
                  title={
                    <Tooltip title={department} placement="top">
                      <Typography
                        variant="subtitle1"
                        component="div"
                        style={{
                          maxWidth: 150,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          color: "rgb(11, 41, 72)"
                        }}
                      >
                        {department}
                      </Typography>
                    </Tooltip>
                  }
                  subheader={
                    <Typography
                     variant="subtitle2"
                     style={{
                      maxWidth: 200,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color:"#bdbdbd",
                    }}
                     >
                      Department Head: 
                      
                      {Array.isArray(employees) &&
                        employees
                          .filter((employee: Employee) => employee.JobTitle === "Manager")
                          .map((manager: Employee) => (
                            <Tooltip key={manager.Id} title={`${manager.FirstName} ${manager.LastName}`} placement="bottom" arrow>
                            <span key={manager.Id}>
                              {`${manager.FirstName} ${manager.LastName}`}
                            </span>
                            </Tooltip>
                          ))}
                    </Typography>
                    
                  }
                  
                  
                  action={
                    <>
                      <IconButton aria-label="edit"><EditIcon style={{ color: "rgb(89, 208, 255)" }} /></IconButton>
                      <IconButton aria-label="delete"><DeleteIcon style={{ color: "rgb(11, 41, 72)" }} /></IconButton>
                    </>
                  }
                />
                <Divider />
                <CardContent style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <AvatarGroup max={3}>
                    {Array.isArray(employees) &&
                      employees.map((employee: Employee) => (
                        employee.JobTitle !== "Manager" && (
                        <Tooltip key={employee.Id} title={`${employee.FirstName} ${employee.LastName}`} placement="bottom" arrow>
                          <Avatar
                            key={employee.Id}
                            {...this.stringAvatar(`${employee.FirstName} ${employee.LastName}`)}
                          />
                        </Tooltip>
                        )
                      ))}
                  </AvatarGroup>
                  <Button variant="contained" size="small" style={{ color: "rgb(139, 161, 183)", backgroundColor: "rgb(11, 41, 72)" }} endIcon={<AddCircleOutlineIcon style={{ color: "rgb(89, 208, 255)" }} />} >Add Member</Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): StateProps  => ({
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
  }
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DepartmentsList)
);

