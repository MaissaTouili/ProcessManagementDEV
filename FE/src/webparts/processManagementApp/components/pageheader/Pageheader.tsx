import { Avatar, Card, Paper, Typography, styled } from "@mui/material";
import * as React from "react";


interface PageHeaderProps {
    title: string;
    subTitle: string;
    icon: React.ReactNode;
  }
  const Root = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fdfdff'
  }));
  
  const PageHeaderContainer = styled("div")(({ theme }) => ({
    padding: theme.spacing(4),
    display: 'flex',
    marginBottom: theme.spacing(2)
  }));
  
  const PageIcon = styled(Card)<{ hasAvatar: boolean }>(({ theme, hasAvatar }) => ({
    display: "inline-block",
    padding: theme.spacing(2),
    color: "#3c44b1",
    visibility: hasAvatar ? "hidden" : "visible", // Hide the icon if an Avatar is present
  }));
  
  const PageTitle = styled("div")(({ theme }) => ({
    paddingLeft: theme.spacing(4),
    '& .MuiTypography-subtitle2': {
      opacity: '0.6'
    }
  }));

  const PageHeader: React.FC<PageHeaderProps> =(props: PageHeaderProps)  => {
    const { title, subTitle, icon } = props;
    const hasAvatar = React.isValidElement(icon) && icon.type === Avatar;
  
    return (
      <Root elevation={0} square>
        <PageHeaderContainer>
        {hasAvatar ? (
          <Avatar sx={{ width: "50px", height: "50px" }}>{icon}</Avatar>
        ) : (
          <PageIcon hasAvatar={hasAvatar}>{icon}</PageIcon>
        )}
          <PageTitle>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            <Typography variant="subtitle2" component="div">
              {subTitle}
            </Typography>
          </PageTitle>
        </PageHeaderContainer>
      </Root>
    );
  }
  export default PageHeader;