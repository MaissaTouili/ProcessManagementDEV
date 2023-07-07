import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
// import { escape } from '@microsoft/sp-lodash-subset';

// import styles from './ProcessManagementAppWebPart.module.scss';
import * as strings from 'ProcessManagementAppWebPartStrings';
import { Provider } from 'react-redux';
import EmployeesList from './components/employees/EmployeesList';
import AddEmployee from './components/employees/AddEmployee';
// import NotFound from './components/NotFound';
import { createStore } from 'redux';
import { BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import RootReducer from './store/reducers/RootReducer';
import UpdateEmployee from './components/employees/UpdateEmployee';
import { ProSidebarProvider } from "react-pro-sidebar";
import SideNavbar from './components/sidebar/SideNavbar';
import Overview from './components/overview/Overview';
import NbrOfHoursWorked from './components/employees/NbrOfHoursWorked';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import LeavesList from './components/leaves/leavesList';
import LeaveRequest from './components/leaves/leaveRequest';
import UpdateLeaveRequest from './components/leaves/UpdateLeaveRequest';
import DepartmentsList from './components/employees/DepartmentsList';
import { getEmployees } from './services/EmployeeService';
import { getLeaves } from './services/LeaveService';
import Profile from './components/employees/Profile';


export interface IProcessManagementAppWebPartProps {
  description: string;
}

export default class ProcessManagementAppWebPart extends BaseClientSideWebPart<IProcessManagementAppWebPartProps> {
  private rootElement: HTMLElement;

  public async render(): Promise<void> {
    if (!this.rootElement) {
      this.rootElement = document.createElement('div');
      this.domElement.appendChild(this.rootElement);
    }


    const store = createStore(RootReducer);
    const user = await this.getCurrentUser();
    const employees = await getEmployees();
    const leaves = await getLeaves();

    const element: React.ReactElement = (
      <Provider store={store}>
        <ProSidebarProvider>
        {/* basename="/sites/ProcessManagementAppDev/_layouts/15/workbench.aspx" */}
          <Router basename="/sites/ProcessManagementAppDev/_layouts/15/workbench.aspx">
          <SideNavbar user={user} employees={employees} leaves={leaves}>
            <Switch>
              <Route exact path="/overview" render={() => <Overview/>} />
              <Route exact path="/employees" render={() => <EmployeesList user={user} />} />
              <Route path="/employees/addEmployee" render={() => <AddEmployee user={user} />} />
              <Route path="/employees/updateEmployee/:Id" render={({ match }) => <UpdateEmployee Id={parseInt(match.params.Id)} user={user} />} />
              <Route path="/employees/hours-worked" render={() => <NbrOfHoursWorked />} />
              <Route path="/employees/departments" render={() => <DepartmentsList user={user} />} />
              <Route exact path="/leaves/leavesOfManager" render={() => <LeavesList employees={employees} user={user} />} />
              <Route exact path="/leaves" render={() => <LeavesList employees={employees} user={user}/>} />
              <Route path="/leaves/SendLeaveRequest" render={() => <LeaveRequest user={user}/>} />
              <Route path="/leaves/UpdateLeaveRequest/:Id" render={({ match }) => <UpdateLeaveRequest Id={parseInt(match.params.Id)} user={user}/>} />
              <Route exact path="/profile" render={() => <Profile user={user} />} />
              <Route render={() => <Redirect to="/overview" />} />
            </Switch>
            </SideNavbar>
          </Router>
        </ProSidebarProvider>
      </Provider>
    );

    ReactDOM.render(element, this.rootElement);
  }
  
  public onDispose(): void {
    if (this.rootElement) {
      ReactDOM.unmountComponentAtNode(this.rootElement);
      this.rootElement.remove();
    }
  }

  private async getCurrentUser(): Promise< SharePointUser | undefined> {
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(
      `${this.context.pageContext.web.absoluteUrl}/_api/web/currentUser`,
      SPHttpClient.configurations.v1
    );
  
    if (response.ok) {
      const user = await response.json();
      return user;
    } else {
      console.log('Error fetching user information:', response.statusText);
      return null;
    }
  }
  
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
