import * as React from 'react';
import { Box } from '@mui/system';
import PageHeader from '../pageheader/Pageheader';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import { PieChart, Pie, Tooltip, LineChart, Line, XAxis, YAxis, Legend} from 'recharts';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { RootState } from '../../store/reducers/RootReducer';
import { Dispatch } from 'redux';

interface IListProps extends RouteComponentProps {}

interface DispatchProps {
}
interface StateProps {
}
class Overview extends React.Component<IListProps> {
  public render(): JSX.Element {
    const pieChartData = [
      { name: 'Category A', value: 400 },
      { name: 'Category B', value: 300 },
      { name: 'Category C', value: 200 },
      { name: 'Category D', value: 100 },
    ];

    const lineChartData = [
      { name: 'Jan', value: 50 },
      { name: 'Feb', value: 100 },
      { name: 'Mar', value: 200 },
      { name: 'Apr', value: 150 },
      { name: 'May', value: 300 },
      { name: 'Jun', value: 250 },
    ];

    const handleGoBack = (): void => {
      const { history } = this.props;
      history.goBack();
    };
  

    return (
      <div>
         <ArrowBackOutlinedIcon onClick={handleGoBack} sx={{color: "rgb(139, 161, 183)"}}/>
        <PageHeader
          title="Overview"
          subTitle="Statistics related to time management"
          icon={<QueryStatsOutlinedIcon fontSize="large" style={{ color: "rgb(11, 41, 72)" }}  />}
        />
          <Box sx={{ display: 'flex', flexWrap: 'wrap'}}>

          <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}} >
            <PieChart width={300} height={300}>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
            
              <LineChart data={lineChartData} width= {300} height= {300}>
                <XAxis dataKey="name" />
                <YAxis />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
                <Tooltip />
                <Legend />
              </LineChart>
          
              </div>
              {/* <BarChart data={barChartData}  width= {250} height= {250} >
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="value" fill="#8884d8" />
                <Tooltip />
                <Legend />
              </BarChart> */}
          </Box>
      </div>
    );
  }
}
const mapStateToProps = (state: RootState):  StateProps => ({
    
});


const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  
});
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)( Overview)
);