import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Grid, Typography, Avatar, IconButton, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import "./i18next";
import { COUNTRIES } from "./countries";

function App() {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const changeLangue = React.useCallback(
    (code) => {
      i18n.changeLanguage(code?.toLowerCase());
    },
    [i18n]
  );

  return (
    <React.Fragment>
      <CssBaseline />
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ width: "100vw", minHeight: "100vh", p: 2 }}
      >
        <Grid item sx={{ width: "100%" }}>
          <Grid
            container
            sx={{ height: 80, width: "100%" }}
            direction="row"
            justifyContent="flex-end"
            spacing={1}
          >
            {COUNTRIES?.map((c) => {
              return (
                <Grid item key={c?.code}>
                  <IconButton onClick={() => changeLangue(c?.code)}>
                    <Avatar
                      sx={{
                        border:
                          i18n?.language === c?.code?.toLowerCase() &&
                          `2px solid ${theme.palette.primary.main}`,
                      }}
                      src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`}
                    />
                  </IconButton>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        <Grid item sx={{ flex: 1 }}>
          <Grid item sx={{ maxWidth: "500px !important" }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container wrap="nowrap" spacing={2} direction="row">
                  <Grid item>
                    <Avatar
                      src="https://d33wubrfki0l68.cloudfront.net/e63c232b49651fa715f8be87b5a0b0262a70f57a/cec2e/images/logo-icon-s.svg"
                      sx={{ width: 150, height: "auto" }}
                      size="large"
                    />
                  </Grid>
                  <Grid item>
                    <Grid container direction="column" spacing={1}>
                      <Grid item>
                        <Typography variant="h5">
                          {t(`gridly_title`)}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="caption">
                          {t(`gridly_subtitle`)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mt: 5 }}>
                <Typography variant="body2">
                  {t(`gridly_description`)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default App;
