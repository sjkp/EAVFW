import React, { useContext, useRef, useState } from "react";
import { IProgressIndicatorProps, ProgressIndicator } from "@fluentui/react";

function ProgressBar(): JSX.Element {

    const { progressBarProps } = useProgressBarContext();

    console.log("ProgressBar", progressBarProps);
    return (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 0 }}>
            <ProgressIndicator barHeight={4} {...progressBarProps} styles={{ itemProgress: { paddingTop: 0, paddingBottom: 1 } }} />
        </div>
    );
}

type ContextType = {
    progressBarProps: IProgressIndicatorProps,
    showIndeterminateProgressIndicator: () => void,
    showDefaultProgressIndicator: (progress: number) => void,
    setProgressBarProps: (props: IProgressIndicatorProps) => void,
    hideProgressBar: () => void
};

const ProgressBarContext = React.createContext<ContextType>({
    progressBarProps: {}, setProgressBarProps: () => {
    },
    showDefaultProgressIndicator: () => {
    },
    showIndeterminateProgressIndicator: () => {
    },
    hideProgressBar: () => {
    }
});

function useProgressBarContext() {
    return useContext(ProgressBarContext);
}

const ProgressBarProvider = (props: any) => {

    let promise = useRef<Promise<void>>();

    let initialState: IProgressIndicatorProps = { progressHidden: true };

    const [progressBarProps, setProgressPropsState] = useState(initialState);

    let setProgressBarProps = function (props: IProgressIndicatorProps): void {
        console.log('setProgressBarProps', props);
        setProgressPropsState(_ => props);

        promise.current = new Promise<void>(resolve => {
            setTimeout(resolve, 500);
        });
    };

    let showIndeterminateProgressIndicator = function (): void {
        setProgressBarProps({});

    }

    let showDefaultProgressIndicator = function (progress: number): void {
        setProgressBarProps({ percentComplete: progress });
    }

    let hideProgressBar = function (): void {

        if (promise.current) {
            promise.current.then(_ => { if (!promise.current) setProgressPropsState({ progressHidden: true }) });
            promise.current = undefined;  //Dont cancel the timer if its been startet again.
        }
    };

    return (
        <ProgressBarContext.Provider value={{
            progressBarProps,
            hideProgressBar,
            showIndeterminateProgressIndicator,
            showDefaultProgressIndicator,
            setProgressBarProps
        }}>
            {props.children}
        </ProgressBarContext.Provider>
    );
};

export default ProgressBar;
export { ProgressBarProvider, useProgressBarContext, ProgressBarContext };
