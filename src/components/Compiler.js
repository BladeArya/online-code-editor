import { useState, useEffect } from "react";
import AceEditor from "react-ace";
import {
  InputLabel,
  MenuItem,
  Select,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Grid,
  Skeleton,
} from "@mui/material";
import axios from "axios";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "./Compiler.css";

const Compiler = () => {
  const [userCode, setUserCode] = useState("");
  const [languageId, setLanguageId] = useState(50);
  const [userInput, setUserInput] = useState("");
  const [codeOutput, setCodeOutput] = useState("");
  const [editorLanguage, setEditorLanguage] = useState("c_cpp");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let langArray = {
      50: "c_cpp",
      54: "c_cpp",
      62: "java",
      71: "python",
    };
    setEditorLanguage(langArray[languageId]);
  }, [languageId]);

  const handleClickOpen = () => {
    if (userCode !== "" && languageId !== 0) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const userSubmissionHandler = () => {
    setLoading(true);
    setOpen(false);
    var userResponse = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions",
      params: { base64_encoded: "false", fields: "*" },
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "x-rapidapi-key": process.env.REACT_APP_API_KEY,
      },
      data: {
        language_id: languageId,
        source_code: userCode,
        stdin: userInput,
      },
    };

    try {
      axios
        .request(userResponse)
        .then(function (response) {
          const userResponseToken = response.data.token;
          var options = {
            method: "GET",
            url: `https://judge0-ce.p.rapidapi.com/submissions/${userResponseToken}`,
            params: { base64_encoded: "false", fields: "*" },
            headers: {
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
              "x-rapidapi-key": process.env.REACT_APP_API_KEY,
            },
          };

          axios
            .request(options)
            .then(function (response) {
              if (response.data.stdout === null) {
                setCodeOutput(response.data.status.description);
              }
              setLoading(false);
              setCodeOutput(response.data.stdout);
            })
            .catch(function (error) {
              console.error(error);
            });
        })
        .catch(function (error) {
          console.error(error);
        });
    } catch (err) {
      console.log("3", err.message);
      setCodeOutput(err.message);
    }
  };

  return (
    <Grid container className="code_section">
      <Grid item xs={12} md={6}>
        <div className="code_section__input_code">
          <AceEditor
            placeholder="Enter your code here"
            mode={editorLanguage}
            theme="solarized_dark"
            value={userCode}
            fontSize={15}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            onChange={(e) => setUserCode(e)}
          />
        </div>
        <div className="code_section__language_selection">
          <InputLabel
            id="demo-simple-select-label"
            sx={{ paddingRight: 1, paddingTop: 2 }}
          >
            Language
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={languageId}
            label="Select Editor Language"
            onChange={(e) => setLanguageId(e.target.value)}
            sx={{ width: 300, height: 50, paddingRight: 1 }}
          >
            <MenuItem value={50}>C</MenuItem>
            <MenuItem value={54}>C++</MenuItem>
            <MenuItem value={62}>Java</MenuItem>
            <MenuItem value={71}>Python</MenuItem>
          </Select>
          <Button variant="contained" onClick={handleClickOpen}>
            Compile
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Input Value</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Enter input value if required
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="outlined-textarea"
                label="Input Value"
                type="text"
                fullWidth
                variant="standard"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" onClick={userSubmissionHandler}>
                Compile
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Grid>
      <Grid item xs={12} md={6} className="code_section__code_output">
        <div>
          {loading ? (
            <Skeleton variant="rectangular" height={450} />
          ) : (
            <TextField
              fullWidth
              rows={19}
              id="filled-textarea-static"
              label="Output"
              placeholder="Output of the compiled code"
              value={codeOutput}
              multiline
              variant="filled"
              onChange={(e) => setCodeOutput(e.target.value)}
              disabled
            ></TextField>
          )}
        </div>
      </Grid>
    </Grid>
  );
};

export default Compiler;
