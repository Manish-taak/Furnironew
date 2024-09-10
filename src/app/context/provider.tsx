"use client"

import { createContext, useContext, useState, ReactNode } from 'react';

interface userdatatype {
    name?: string
    class?: string
}

export const UserContext = createContext<any>(undefined);



export const UserProvider = ({ children }: { children: ReactNode }) => {
    const userdata = {
        name: 'manish',
        class: 'BCA'
    }


    const [user, setUser] = useState<userdatatype>(userdata);


    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};



export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};


// const {user ,setUser} = useUser(UserContext)






