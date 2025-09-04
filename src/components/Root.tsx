// import {Navigate} from "react-router";
// import {useEffect, useState} from "react";
// import {useGetMe} from "../queries/useGetMe";

// const Root: React.FC = () => {
//     const [redirectPath, setRedirectPath] = useState<string | null>(null);
//     const me = useGetMe();

//     useEffect(() => {
//         if (me.isFetched) {
//             setRedirectPath(me.isSuccess ? "/manage/events" : "/auth/login");
//         }
//     }, [me.isFetched, me.isSuccess]);

//     if (redirectPath) {
//         return <Navigate to={redirectPath} replace={true}/>;
//     }
//     return null;
// };


// export default Root;
