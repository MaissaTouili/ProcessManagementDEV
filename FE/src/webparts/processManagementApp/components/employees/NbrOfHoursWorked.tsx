import * as React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, TablePagination, Button } from '@mui/material';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { RootState } from '../../store/reducers/RootReducer';
import { Dispatch } from 'redux';
import PageHeader from '../pageheader/Pageheader';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';


interface INbrOfHoursWorkedListProps extends RouteComponentProps{

  }
  interface DispatchProps {
  }
  interface StateProps {
  }
  interface INbrOfHoursWorkedListState {
    page: number;
    rowsPerPage: number;
    tableDataDaily: { id: number; employeeName: string; workedHours: { [key: string]: number } }[];
    tableDataWeekly: { id: number; employeeName: string; workedHours: { [key: string]: number } }[];
    tableDataMonthly: { id: number; employeeName: string; workedHours: { [key: string]: number } }[];
    view: 'daily' | 'weekly' | 'monthly';
  }
// Sample data for the table
const hoursWorkedDataDaily = [
    { id: 1, employeeName: 'John Doe', workedHours: { Monday: 8, Tuesday: 7, Wednesday: 6, Thursday: 8, Friday: 7 } },
    { id: 2, employeeName: 'Jane Smith', workedHours: { Monday: 7, Tuesday: 6, Wednesday: 7, Thursday: 6, Friday: 8 } },
    { id: 3, employeeName: 'Mike Johnson', workedHours: { Monday: 8, Tuesday: 8, Wednesday: 8, Thursday: 7, Friday: 6 } },
    { id: 4, employeeName: 'Alice Johnson', workedHours: { Monday: 8, Tuesday: 8, Wednesday: 8, Thursday: 8, Friday: 8 } },
    { id: 5, employeeName: 'Mark Doe', workedHours: { Monday: 8, Tuesday: 8, Wednesday: 8, Thursday: 8, Friday: 8 } },
    { id: 6, employeeName: 'Sophie Smith', workedHours: { Monday: 8, Tuesday: 8, Wednesday: 8, Thursday: 8, Friday: 8 } },
];

const hoursWorkedDataWeekly = [
  { id: 1, employeeName: 'John Doe', workedHours: { Week1: 8, Week2: 7, Week3: 6, Week4: 8}},
  { id: 2, employeeName: 'Jane Smith', workedHours: {  Week1: 8, Week2: 7, Week3: 6, Week4: 8 } },
  { id: 3, employeeName: 'Mike Johnson', workedHours: { Week1: 8, Week2: 7, Week3: 6, Week4: 8 } },
  { id: 4, employeeName: 'Alice Johnson', workedHours: {  Week1: 8, Week2: 7, Week3: 6, Week4: 8 } },
  { id: 5, employeeName: 'Mark Doe', workedHours: {  Week1: 8, Week2: 7, Week3: 6, Week4: 8 } },
  { id: 6, employeeName: 'Sophie Smith', workedHours: { Week1: 8, Week2: 7, Week3: 6, Week4: 8 } },
];
const hoursWorkedDataMonthly = [
  { id: 1, employeeName: 'John Doe', workedHours: { January: 8, February: 7, March: 6, April: 8, May: 7, June: 7, July: 8, August: 8, September: 8, October: 8, November:8, December: 8 } },
  { id: 2, employeeName: 'Jane Smith', workedHours: { January: 8, February: 7, March: 6, April: 8, May: 7, June: 7, July: 8, August: 8, September: 8, October: 8, November:8, December: 8 } },
  { id: 3, employeeName: 'Mike Johnson', workedHours: { January: 8, February: 7, March: 6, April: 8, May: 7, June: 7, July: 8, August: 8, September: 8, October: 8, November:8, December: 8 } },
  { id: 4, employeeName: 'Alice Johnson', workedHours: { January: 8, February: 7, March: 6, April: 8, May: 7, June: 7, July: 8, August: 8, September: 8, October: 8, November:8, December: 8 } },
  { id: 5, employeeName: 'Mark Doe', workedHours: { January: 8, February: 7, March: 6, April: 8, May: 7, June: 7, July: 8, August: 8, September: 8, October: 8, November:8, December: 8 } },
  { id: 6, employeeName: 'Sophie Smith', workedHours: { January: 8, February: 7, March: 6, April: 8, May: 7, June: 7, July: 8, August: 8, September: 8, October: 8, November:8, December: 8 } },
];

const styles: { [key: string]: React.CSSProperties } = {
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: '15px',
  },
  monthYearLabel: {
    marginRight: '10px',
    fontWeight: 'bold',
    color: "gb(11, 41, 72)"

  },
  weekLabel: {
    fontWeight: 'bold',
    color: "gb(11, 41, 72)"
  },
};
class NbrOfHoursWorked extends React.Component<INbrOfHoursWorkedListProps, INbrOfHoursWorkedListState> {
  constructor(props: INbrOfHoursWorkedListProps) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 5,
      tableDataDaily: [],
      tableDataWeekly: [],
      tableDataMonthly: [],
      view: 'daily',
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

  componentDidMount(): void {
    setTimeout(() => {
      this.setState({ 
        tableDataDaily: hoursWorkedDataDaily,
        tableDataWeekly: hoursWorkedDataWeekly, 
        tableDataMonthly: hoursWorkedDataMonthly,
       });
    }, 1000);
  }
  getCurrentMonthYear = (): string => {
    const currentDate = new Date();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentMonth = monthNames[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();
    return `${currentMonth} ${currentYear}`;
  };
  

  handleGoBack = (): void => {
    const { history } = this.props;
    history.goBack();
  };

  handleViewChange = (view: 'daily' | 'weekly' | 'monthly'): void => {
    this.setState({ view });
  };


  renderTableOfDaily = (): JSX.Element => {
    const { tableDataDaily } = this.state;
    const daysOfWeek = Object.keys(tableDataDaily.length > 0 ? tableDataDaily[0].workedHours : []);
    const currentDate = new Date();
  const currentWeek = Math.ceil(currentDate.getDate() / 7);

    return (
      <div>
        <div style={styles.headerContainer}>
          <div style={styles.monthYearLabel}>{this.getCurrentMonthYear()}</div>
          <div style={styles.weekLabel}>{`Week ${currentWeek}`}</div>
        </div>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>Employee Name</TableCell>
            {daysOfWeek.map((day) => (
              <TableCell key={day}>{day}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableDataDaily.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.employeeName}</TableCell>
              {daysOfWeek.map((day) => (
                <TableCell key={day}>{row.workedHours[day]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    );
  };
  renderTableOfWeekly = (): JSX.Element => {
    const { tableDataWeekly } = this.state;
    const weeks = Object.keys(tableDataWeekly.length > 0 ? tableDataWeekly[0].workedHours : []);
  
    return (
      <div>
        <div style={styles.headerContainer}>
        <div style={styles.monthYearLabel}>{this.getCurrentMonthYear()}</div>
        </div>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>Employee Name</TableCell>
            {weeks.map((week) => (
              <TableCell key={week}>{week}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableDataWeekly.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.employeeName}</TableCell>
              {weeks.map((week) => (
                <TableCell key={week}>{row.workedHours[week]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    );
  };
  
  renderTableOfMonthly = ():JSX.Element => {
    const { tableDataMonthly } = this.state;
    const months = Object.keys(tableDataMonthly.length > 0 ? tableDataMonthly[0].workedHours : []);

    return (
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>Employee Name</TableCell>
            {months.map((month) => (
              <TableCell key={month}>{month}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableDataMonthly.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.employeeName}</TableCell>
              {months.map((month) => (
                <TableCell key={month}>{row.workedHours[month]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  render(): JSX.Element {
    const { tableDataDaily, tableDataWeekly, tableDataMonthly, view  } = this.state;
    const { page, rowsPerPage } = this.state;
    let totalCount = 0;

    if (view === 'daily') {
      totalCount = tableDataDaily.length;
    } else if (view === 'weekly') {
      totalCount = tableDataWeekly.length;
    } else if (view === 'monthly') {
      totalCount = tableDataMonthly.length;
    }

    return (
      <div>
         <ArrowBackOutlinedIcon onClick={this.handleGoBack} sx={{color: "rgb(139, 161, 183)"}}/>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
          <PageHeader
            title="Employees"
            subTitle="Number of hours worked for all employees"
            icon={<EventOutlinedIcon fontSize="large" style={{ color: "rgb(11, 41, 72)" }}/>}
          />
          <div style={{ display: "flex", flexDirection: "row-reverse" }}>
            <Button variant="contained" size="small" style={{
              color: view === 'daily' ? '#fff' : 'rgb(139, 161, 183)',
              backgroundColor: view === 'daily' ? 'rgb(11, 41, 72)' : 'transparent',
              marginLeft: '10px'
            }}
              onClick={() => this.handleViewChange('daily')} >Daily</Button>
            <Button variant="contained" size="small" style={{
              color: view === 'weekly' ? '#fff' : 'rgb(139, 161, 183)',
              backgroundColor: view === 'weekly' ? 'rgb(11, 41, 72)' : 'transparent',
              marginLeft: '10px'
            }}
              onClick={() => this.handleViewChange('weekly')} >Weekly</Button>
            <Button variant="contained" size="small" style={{
              color: view === 'monthly' ? '#fff' : 'rgb(139, 161, 183)',
              backgroundColor: view === 'monthly' ? 'rgb(11, 41, 72)' : 'transparent'
            }}
              onClick={() => this.handleViewChange('monthly')} >Monthly</Button>
          </div>
        </div>
        {(tableDataDaily.length === 0 || tableDataWeekly.length === 0 || tableDataMonthly.length === 0) ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress sx={{ color: "rgb(89, 208, 255)" }} />
                </div>
        ) : (
            <Paper sx={{ maxWidth: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 300 }}>
                {view === 'daily' && this.renderTableOfDaily()}
                {view === 'weekly' && this.renderTableOfWeekly()}
                {view === 'monthly' && this.renderTableOfMonthly()}
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
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
    
  });
  

  const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    
  });

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(NbrOfHoursWorked)
  );

