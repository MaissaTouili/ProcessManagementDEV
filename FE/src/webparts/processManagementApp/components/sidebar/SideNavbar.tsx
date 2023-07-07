import * as React from "react";
import { Sidebar, Menu, MenuItem, useProSidebar, SubMenu, } from "react-pro-sidebar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import WavingHandOutlinedIcon from '@mui/icons-material/WavingHandOutlined';
//import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import SummarizeIcon from '@mui/icons-material/Summarize';
// import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { Link } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import ViewListIcon from '@mui/icons-material/ViewList';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';


interface SideNavbarProps {
    children: React.ReactNode;
    user: SharePointUser;
    employees: Employee[];
    leaves: Leave[];
}

const SideNavbar: React.FC<SideNavbarProps> = ({ children, user, employees, leaves }) => {
    const FirstDivStyles = {
        width: "100%",
    };

    const SidebarStyles = {
        color: "rgb(139, 161, 183)",
        height: "100vh",
    }

    const mainDivStyles = {
        margin: "20px 2rem 20px 2rem",
    };

    const IconStyles = {
        color: "rgb(89, 208, 255)"
    };

    const MenuItemStyles = {
        backgroundColor: "rgb(11, 41, 72)", // Set the desired background color
        transition: "background-color 0.3s ease",
        cursor: "pointer",
    };

    const { collapseSidebar } = useProSidebar();

    // State to track the sidebar's open/closed state
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    // State to track the active/hovered menu item
    const [activeMenuItem, setActiveMenuItem] = React.useState("");
    //const location = useLocation();

    // Event handler for menu item hover
    const handleMenuItemHover = (menuItem: string): void => {
        setActiveMenuItem(menuItem);
    };

    // Event handler for toggling the sidebar state
    const toggleSidebar = (): void => {
        setIsSidebarOpen(!isSidebarOpen);
        collapseSidebar(); // Collapse the sidebar after clicking on "Admin"
    };

    
    return (
        <div className="webpart-container" style={{ ...FirstDivStyles, display: "grid", gridTemplateColumns: "auto 1fr", minHeight: "100vh" }}>
            <Sidebar backgroundColor="rgb(11, 41, 72)" style={SidebarStyles} collapsed={!isSidebarOpen}>
                <Menu>
                    <MenuItem
                        icon={<MenuOutlinedIcon style={IconStyles} />}
                        onClick={() => {
                            toggleSidebar();
                        }}
                        style={{ ...MenuItemStyles, textAlign: "center" }}
                    >
                        {" "}
                        {user && <h4>{user.Title}</h4>}
                    </MenuItem>

                    {user && (
                        <>
                            {employees.map((employee: Employee) => { //Manager
                                if (employee.JobTitle === "Manager" && user.Title === `${employee.FirstName} ${employee.LastName}`) {
                                    return (
                                        <div style={{ marginTop: "30px" }}>
                                            <MenuItem style={{
                                                ...MenuItemStyles,
                                                backgroundColor: activeMenuItem === "overview" ? "lightgray" : MenuItemStyles.backgroundColor,
                                                color: activeMenuItem === "overview" ? "rgb(11, 41, 72)" : SidebarStyles.color
                                            }} icon={<HomeOutlinedIcon style={IconStyles} />} component={<Link to="/overview" />} onMouseEnter={() => handleMenuItemHover("overview")}
                                                onMouseLeave={() => handleMenuItemHover("")}>
                                                Overview
                                            </MenuItem>

                                            <SubMenu style={{
                                                ...MenuItemStyles,
                                                backgroundColor: activeMenuItem === "employees" ? "lightgray" : MenuItemStyles.backgroundColor,
                                                color: activeMenuItem === "employees" ? "rgb(11, 41, 72)" : SidebarStyles.color
                                            }} icon={<CalendarTodayOutlinedIcon style={IconStyles} />} label="Time Management" onMouseEnter={() => handleMenuItemHover("employees")}
                                                onMouseLeave={() => handleMenuItemHover("")}>
                                                <MenuItem style={{
                                                    ...MenuItemStyles,
                                                    backgroundColor: activeMenuItem === "employeesList" ? "lightgray" : MenuItemStyles.backgroundColor,
                                                    color: activeMenuItem === "employeesList" ? "rgb(11, 41, 72)" : SidebarStyles.color
                                                }} icon={<PeopleOutlinedIcon style={IconStyles} />} component={<Link to="/employees" />} onMouseEnter={() => handleMenuItemHover("employeesList")}
                                                    onMouseLeave={() => handleMenuItemHover("")}>
                                                    List Of Employees
                                                </MenuItem>

                                                <MenuItem style={{
                                                    ...MenuItemStyles,
                                                    backgroundColor: activeMenuItem === "employeeAddForm" ? "lightgray" : MenuItemStyles.backgroundColor,
                                                    color: activeMenuItem === "employeeAddForm" ? "rgb(11, 41, 72)" : SidebarStyles.color
                                                }} icon={<PeopleOutlinedIcon style={IconStyles} />} component={<Link to="/employees/addEmployee" />} onMouseEnter={() => handleMenuItemHover("employeeAddForm")}
                                                    onMouseLeave={() => handleMenuItemHover("")}>
                                                    Add An Employee
                                                </MenuItem>
                                            </SubMenu>

                                            <SubMenu style={{
                                                ...MenuItemStyles,
                                                backgroundColor: activeMenuItem === "leaves" ? "lightgray" : MenuItemStyles.backgroundColor,
                                                color: activeMenuItem === "leaves" ? "rgb(11, 41, 72)" : SidebarStyles.color
                                            }} icon={<WavingHandOutlinedIcon style={IconStyles} />} label="Leave Management" onMouseEnter={() => handleMenuItemHover("leaves")}
                                                onMouseLeave={() => handleMenuItemHover("")}>

                                                <MenuItem style={{
                                                    ...MenuItemStyles,
                                                    backgroundColor: activeMenuItem === "leavesListForEmployees" ? "lightgray" : MenuItemStyles.backgroundColor,
                                                    color: activeMenuItem === "leavesListForEmployees" ? "rgb(11, 41, 72)" : SidebarStyles.color
                                                }} icon={<ViewListIcon style={IconStyles} />} component={<Link to="/leaves" />} 
                                                    onMouseEnter={() => handleMenuItemHover("leavesListForEmployees")}
                                                    onMouseLeave={() => handleMenuItemHover("")}>
                                                    List Of Leaves for employees
                                                </MenuItem>
                                                <MenuItem style={{
                                                    ...MenuItemStyles,
                                                    backgroundColor: activeMenuItem === "leavesList" ? "lightgray" : MenuItemStyles.backgroundColor,
                                                    color: activeMenuItem === "leavesList" ? "rgb(11, 41, 72)" : SidebarStyles.color
                                                }} icon={<ViewListIcon style={IconStyles} />} component={<Link to="/leaves/leavesOfManager" />} 
                                                    onMouseEnter={() => handleMenuItemHover("leavesList")}
                                                    onMouseLeave={() => handleMenuItemHover("")}>
                                                    List Of Leaves
                                                </MenuItem>
                                                <MenuItem style={{
                                                    ...MenuItemStyles,
                                                    backgroundColor: activeMenuItem === "leaveRequest" ? "lightgray" : MenuItemStyles.backgroundColor,
                                                    color: activeMenuItem === "leaveRequest" ? "rgb(11, 41, 72)" : SidebarStyles.color,
                                                    opacity: leaves.some((leave) => leave.Status === 'In Progress' && leave.EmployeeName === user.Title) ? 0.5 : 1,
                                                }} icon={<InsertDriveFileOutlinedIcon style={IconStyles} />}
                                                    component={<Link to="/leaves/SendLeaveRequest" />}
                                                    onMouseEnter={() => handleMenuItemHover("leaveRequest")}
                                                    onMouseLeave={() => handleMenuItemHover("")}
                                                    disabled={leaves.some((leave: Leave) => leave.Status === "In Progress" && leave.EmployeeName === user.Title)}>
                                                    Leave Request
                                                </MenuItem>
                                            </SubMenu>

                                            <MenuItem style={{
                                                ...MenuItemStyles,
                                                backgroundColor: activeMenuItem === "reports" ? "lightgray" : MenuItemStyles.backgroundColor,
                                                color: activeMenuItem === "reports" ? "rgb(11, 41, 72)" : SidebarStyles.color
                                            }} icon={<SummarizeIcon style={IconStyles} />} onMouseEnter={() => handleMenuItemHover("reports")}
                                                onMouseLeave={() => handleMenuItemHover("")}>Reports Management
                                            </MenuItem>

                                            {/* <MenuItem icon={<HelpOutlineOutlinedIcon />}>FAQ</MenuItem>
                                <MenuItem icon={<CalendarTodayOutlinedIcon />}>Calendar</MenuItem> */}
                                        </div>
                                    )
                                }
                            })}


                            {user.IsSiteAdmin && !employees.some((employee) => employee.JobTitle === "Manager" && user.Title === `${employee.FirstName} ${employee.LastName}`) && (// only Admin
                                <div style={{ marginTop: "30px" }}>
                                    <MenuItem style={{
                                        ...MenuItemStyles,
                                        backgroundColor: activeMenuItem === "overview" ? "lightgray" : MenuItemStyles.backgroundColor,
                                        color: activeMenuItem === "overview" ? "rgb(11, 41, 72)" : SidebarStyles.color
                                    }} icon={<HomeOutlinedIcon style={IconStyles} />} component={<Link to="/overview" />} onMouseEnter={() => handleMenuItemHover("overview")}
                                        onMouseLeave={() => handleMenuItemHover("")}>
                                        Overview
                                    </MenuItem>

                                    <SubMenu style={{
                                        ...MenuItemStyles,
                                        backgroundColor: activeMenuItem === "employees" ? "lightgray" : MenuItemStyles.backgroundColor,
                                        color: activeMenuItem === "employees" ? "rgb(11, 41, 72)" : SidebarStyles.color
                                    }} icon={<CalendarTodayOutlinedIcon style={IconStyles} />} label="Time Management" onMouseEnter={() => handleMenuItemHover("employees")}
                                        onMouseLeave={() => handleMenuItemHover("")}>
                                        <MenuItem style={{
                                            ...MenuItemStyles,
                                            backgroundColor: activeMenuItem === "employeesList" ? "lightgray" : MenuItemStyles.backgroundColor,
                                            color: activeMenuItem === "employeesList" ? "rgb(11, 41, 72)" : SidebarStyles.color
                                        }} icon={<PeopleOutlinedIcon style={IconStyles} />} component={<Link to="/employees" />} onMouseEnter={() => handleMenuItemHover("employeesList")}
                                            onMouseLeave={() => handleMenuItemHover("")}>
                                            List Of All Employees
                                        </MenuItem>
                                        <MenuItem style={{
                                            ...MenuItemStyles,
                                            backgroundColor: activeMenuItem === "employeeAddForm" ? "lightgray" : MenuItemStyles.backgroundColor,
                                            color: activeMenuItem === "employeeAddForm" ? "rgb(11, 41, 72)" : SidebarStyles.color
                                        }} icon={<PeopleOutlinedIcon style={IconStyles} />} component={<Link to="/employees/addEmployee" />} onMouseEnter={() => handleMenuItemHover("employeeAddForm")}
                                            onMouseLeave={() => handleMenuItemHover("")}>
                                            Add An Employee
                                        </MenuItem>
                                    </SubMenu>

                                    <SubMenu style={{
                                        ...MenuItemStyles,
                                        backgroundColor: activeMenuItem === "leaves" ? "lightgray" : MenuItemStyles.backgroundColor,
                                        color: activeMenuItem === "leaves" ? "rgb(11, 41, 72)" : SidebarStyles.color
                                    }} icon={<WavingHandOutlinedIcon style={IconStyles} />} label="Leave Management" onMouseEnter={() => handleMenuItemHover("leaves")}
                                        onMouseLeave={() => handleMenuItemHover("")}>

                                        <MenuItem style={{
                                            ...MenuItemStyles,
                                            backgroundColor: activeMenuItem === "leavesList" ? "lightgray" : MenuItemStyles.backgroundColor,
                                            color: activeMenuItem === "leavesList" ? "rgb(11, 41, 72)" : SidebarStyles.color
                                        }} icon={<ViewListIcon style={IconStyles} />} component={<Link to="/leaves" />} onMouseEnter={() => handleMenuItemHover("leavesList")}
                                            onMouseLeave={() => handleMenuItemHover("")}>
                                            List Of Leaves for Employees
                                        </MenuItem>
                                    </SubMenu>

                                    <MenuItem style={{
                                        ...MenuItemStyles,
                                        backgroundColor: activeMenuItem === "reports" ? "lightgray" : MenuItemStyles.backgroundColor,
                                        color: activeMenuItem === "reports" ? "rgb(11, 41, 72)" : SidebarStyles.color
                                    }} icon={<SummarizeIcon style={IconStyles} />} onMouseEnter={() => handleMenuItemHover("reports")}
                                        onMouseLeave={() => handleMenuItemHover("")}>Reports Management
                                    </MenuItem>

                                    {/* <MenuItem icon={<HelpOutlineOutlinedIcon />}>FAQ</MenuItem>
                                       <MenuItem icon={<CalendarTodayOutlinedIcon />}>Calendar</MenuItem> */}
                                </div>
                            )}

                            {!user.IsSiteAdmin && !employees.some((employee) => employee.JobTitle === "Manager" && user.Title === `${employee.FirstName} ${employee.LastName}`) && (// only Admin
                                <div style={{ marginTop: "30px" }}>
                                    <MenuItem style={{
                                        ...MenuItemStyles,
                                        backgroundColor: activeMenuItem === "overview" ? "lightgray" : MenuItemStyles.backgroundColor,
                                        color: activeMenuItem === "overview" ? "rgb(11, 41, 72)" : SidebarStyles.color
                                    }} icon={<HomeOutlinedIcon style={IconStyles} />} component={<Link to="/overview" />} onMouseEnter={() => handleMenuItemHover("overview")}
                                        onMouseLeave={() => handleMenuItemHover("")}>
                                        Overview
                                    </MenuItem>

                                    <SubMenu style={{
                                        ...MenuItemStyles,
                                        backgroundColor: activeMenuItem === "leaves" ? "lightgray" : MenuItemStyles.backgroundColor,
                                        color: activeMenuItem === "leaves" ? "rgb(11, 41, 72)" : SidebarStyles.color
                                    }} icon={<WavingHandOutlinedIcon style={IconStyles} />} label="Leave Management" onMouseEnter={() => handleMenuItemHover("leaves")}
                                        onMouseLeave={() => handleMenuItemHover("")}>

                                        <MenuItem style={{
                                            ...MenuItemStyles,
                                            backgroundColor: activeMenuItem === "leavesList" ? "lightgray" : MenuItemStyles.backgroundColor,
                                            color: activeMenuItem === "leavesList" ? "rgb(11, 41, 72)" : SidebarStyles.color
                                        }} icon={<ViewListIcon style={IconStyles} />} component={<Link to="/leaves" />} onMouseEnter={() => handleMenuItemHover("leavesList")}
                                            onMouseLeave={() => handleMenuItemHover("")}>
                                            List Of Leaves
                                        </MenuItem>
                                        <MenuItem style={{
                                            ...MenuItemStyles,
                                            backgroundColor: activeMenuItem === "leaveRequest" ? "lightgray" : MenuItemStyles.backgroundColor,
                                            color: activeMenuItem === "leaveRequest" ? "rgb(11, 41, 72)" : SidebarStyles.color,
                                            opacity: leaves.some((leave) => leave.Status === 'In Progress' && leave.EmployeeName === user.Title) ? 0.5 : 1,
                                        }} icon={<InsertDriveFileOutlinedIcon style={IconStyles} />}
                                            component={<Link to="/leaves/SendLeaveRequest" />}
                                            onMouseEnter={() => handleMenuItemHover("leaveRequest")}
                                            onMouseLeave={() => handleMenuItemHover("")}
                                            disabled={leaves.some((leave: Leave) => leave.Status === "In Progress" && leave.EmployeeName === user.Title)}>
                                            Leave Request
                                        </MenuItem>
                                    </SubMenu>

                                    <MenuItem style={{
                                        ...MenuItemStyles,
                                        backgroundColor: activeMenuItem === "reports" ? "lightgray" : MenuItemStyles.backgroundColor,
                                        color: activeMenuItem === "reports" ? "rgb(11, 41, 72)" : SidebarStyles.color
                                    }} icon={<SummarizeIcon style={IconStyles} />} onMouseEnter={() => handleMenuItemHover("reports")}
                                        onMouseLeave={() => handleMenuItemHover("")}>Reports Management
                                    </MenuItem>

                                    {/* <MenuItem icon={<HelpOutlineOutlinedIcon />}>FAQ</MenuItem>
                    <MenuItem icon={<CalendarTodayOutlinedIcon />}>Calendar</MenuItem> */}
                                </div>
                            )}
                        </>
                    )}
                </Menu>
            </Sidebar>

            <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: '100vh' }}>
                <div className="navbar-container">
                    <Navbar />
                </div>
                <div className="mainDiv" style={{ ...mainDivStyles, overflow: 'auto' }}>
                    {children}
                </div>
            </div>
        </div>
    )

}


export default (SideNavbar);


