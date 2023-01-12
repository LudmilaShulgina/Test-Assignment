import React, {useCallback, useEffect, useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import structure from './mock/paths.json';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';

const theme = createTheme();

const PATH_DEFAULT = "# "

export default function App() {
    const [path, setPath] = useState<string>(PATH_DEFAULT)
    const [options, setOptions] = useState<{ title: string }[]>([{title: "1"}, {title: "2"}, {title: "3"}])

    const parcePathString = useCallback((value: string): string[] => {
        return value.replaceAll("#", "").trim().split("/").filter(str => !!str);
    }, [])

    const handleSelectOption = useCallback((value: string) => {
        const pathArray = parcePathString(path);
        const newPathArray = [...pathArray, value];
        setPath(`# ${newPathArray.join("/")}`)
    }, [parcePathString, path])

    const handleChangePath = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPath(event.target.value);
    };

    const getOptions = (pathArray: string[]) => {
        let counter = 0;
        const pathObject = structure.find(obj => Object.keys(obj)[0] === pathArray[0])

        if (!pathObject) {
            return []
        }

        // @ts-ignore
        const getter = (pathObject: Record<string, any>) => {
            if (counter === pathArray.length - 1) {
                return pathObject[pathArray[counter]].map((item: any) => {
                    if (typeof item === "string") {
                        return {title: item}
                    } else {
                        return {title: Object.keys(item)[0]}
                    }
                })
            }
            counter = ++counter;
            const currentPath = pathObject[pathArray[counter - 1]].find((item: any) => {
                return item === pathArray[counter] || Object.keys(item)[0] === pathArray[counter]
            })
            if (!currentPath || typeof currentPath === "string") {
                return []
            } else if (Array.isArray(currentPath)) {
                currentPath.map(item => {
                    if (typeof item === "string") {
                        return {title: item}
                    } else {
                        return Object.keys(item)[0]
                    }
                })
            } else {
                return getter(currentPath);
            }
        };

        const myPath = getter(pathObject)
        setOptions(myPath)
    }

    useEffect(() => {
        const pathArray = parcePathString(path);
        if (!pathArray.length) {
            setOptions(structure.map(item => {
                return {title: Object.keys(item)[0]}
            }))
        } else {
            getOptions(pathArray)
        }
    }, [parcePathString, path])

    useEffect(() => {
        if (!path) {
            setPath(PATH_DEFAULT)
        }
    }, [path])

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="lg">
                <CssBaseline/>
                <Box sx={{marginTop: 8}}>
                    <TextField
                        fullWidth={true}
                        value={path}
                        onChange={handleChangePath}
                        label="Path"
                    />
                    <Stack direction="row" spacing={1} sx={{marginTop: 4}}>
                        {options.map(option => (
                            <Chip
                                key={option.title}
                                label={option.title}
                                onClick={() => handleSelectOption(option.title)}
                            />
                        ))}
                    </Stack>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
