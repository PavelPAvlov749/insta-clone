import React, { Children, ReactNode } from "react";

interface Props  {
    children? : ReactNode
}
interface State {
    hasError : boolean
}

export class ErrorBoundary extends React.Component<Props,State>{
    constructor(props:any){
        super(props)
        this.state = {hasError : false  }
    }
    
    static componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.log("Error")
        return (
            <div>
                <h1>Something went wrong</h1>
            </div>
        )
    }


    render(): React.ReactNode {
        if(this.state.hasError){
                    return(
            <section>
                <h1>Something went wrong</h1>
            </section>
        )
        }else{
            return this.props.children
        }

    }
}