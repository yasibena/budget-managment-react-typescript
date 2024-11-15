import { createContext, useReducer, ReactNode, ReactElement } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Wallet, Transaction, Budget, Goal } from "../types/types";


interface AuthState {
    isAuthenticated: boolean;
    user: any | null;
}

const initialAuthState: AuthState = {
    isAuthenticated: false,
    user: null,
}

const enum REDUCER_ACTION_TYPE {
    SIGN_IN,
    SIGN_UP,
    LOGOUT,
    ADD_WALLET,
    ADD_GOAL,
    ADD_TRANSACTION,
    GET_WALLET_BY_ID,
    GET_GOAL_BY_ID,
    REMOVE_WALLET,
    REMOVE_BUDGET,
    REMOVE_GOAL,
    REMOVE_TRANSACTION,
    ADD_BUDGET,
    GET_BUDGET_BY_ID,
}

interface AuthAction {
    type: REDUCER_ACTION_TYPE,
    payload?: any
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case REDUCER_ACTION_TYPE.SIGN_IN:
        case REDUCER_ACTION_TYPE.SIGN_UP:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload || null
            };
        case REDUCER_ACTION_TYPE.LOGOUT:
            return {
                ...state,
                isAuthenticated: false,
                user: null
            };
        case REDUCER_ACTION_TYPE.ADD_WALLET:
            return {
                ...state,
                user: {
                    ...state.user,
                    wallets: [...state.user.wallets, action.payload]
                }

            }
        case REDUCER_ACTION_TYPE.ADD_BUDGET:
            return {
                ...state,
                user: {
                    ...state.user,
                    budgets: [...state.user.budgets, action.payload]
                }

            }
        case REDUCER_ACTION_TYPE.ADD_GOAL:
            return {
                ...state,
                user: {
                    ...state.user,
                    goals: [...state.user.goals, action.payload]
                }

            }
        case REDUCER_ACTION_TYPE.ADD_TRANSACTION:
                const updatedWallets = state.user.wallets.map((wallet: Wallet) => {
                    if (wallet.id === action.payload.walletId) {
                        return {
                            ...wallet,
                            balance: wallet.balance + action.payload.amount,
                        };
                    }
                    return wallet;
                });

                return {
                    ...state,
                    user: {
                        ...state.user,
                        wallets: updatedWallets,
                        transactions: [...state.user.transactions, action.payload],
                    },
                };
           
           


        case REDUCER_ACTION_TYPE.REMOVE_WALLET:
            return {
                ...state,
                user: {
                    ...state.user,
                    wallets: state.user.wallets.filter(
                        (wallet: Wallet) => wallet.id !== action.payload
                    ),
                },
            };
        case REDUCER_ACTION_TYPE.REMOVE_BUDGET:
            return {
                ...state,
                user: {
                    ...state.user,
                    budgets: state.user.budgets.filter(
                        (budget: Budget) => budget.id !== action.payload
                    ),
                },
            };
        case REDUCER_ACTION_TYPE.REMOVE_GOAL:
            return {
                ...state,
                user: {
                    ...state.user,
                    goals: state.user.goals.filter(
                        (goal: Goal) => goal.id !== action.payload
                    ),
                },
            };
        case REDUCER_ACTION_TYPE.REMOVE_TRANSACTION:
            return {
                ...state,
                user: {
                    ...state.user,
                    transactions: state.user.transactions.filter(
                        (transaction: Transaction) => transaction.id !== action.payload
                    ),
                },
            };
        case REDUCER_ACTION_TYPE.GET_WALLET_BY_ID:
            return {
                ...state,
                user: {
                    ...state.user,
                    wallets: state.user.wallets
                }

            };
        case REDUCER_ACTION_TYPE.GET_BUDGET_BY_ID:
            return {
                ...state,
                user: {
                    ...state.user,
                    budgets: state.user.budgets
                }

            };
        case REDUCER_ACTION_TYPE.GET_GOAL_BY_ID:
            return {
                ...state,
                user: {
                    ...state.user,
                    goals: state.user.goals
                }

            };
        default:
            throw new Error("Something is wrong");
    }
}

const saveToLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
}

const getLocalFromStorage = (key: string) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Error retrieving from local storage", error);
        return null;
    }
}

const useMainContext = () => {
    const [state, dispatch] = useReducer(authReducer, initialAuthState);

    const fetchItems = (key: string) => {
        const user = getLocalFromStorage(key);
        if (user) {
            dispatch({ type: REDUCER_ACTION_TYPE.SIGN_IN, payload: user });
        } else {
            console.log("No user found in local storage");
        }
    }

    const signIn = async (email: string, password: string) => {
        const user = getLocalFromStorage('users');
        if (user && user.password === password) {
            dispatch({ type: REDUCER_ACTION_TYPE.SIGN_IN, payload: user });
        } else {
            throw new Error("Invalid credentials");
        }
    }

    const signUp = async (username: string, email: string, password: string) => {
        const userId = uuidv4();
        const defaultWallets = [
            { id: 1, name: 'City Bank', type: 'Bank', balance: 2000, currency: 'USD', creditLimit: 5000, userId },
            { id: 2, name: 'Cash', type: 'Cash', balance: 3000, currency: 'USD', creditLimit: 2000, userId },

        ]

        const defualtBudget = [
            {
                id: 1,
                name: 'Grocery',
                totalAmount: 300,
                userId: 1,
                period: 'Overtime',
                startDate: '2024-11-01',
                lastMonthExpenses: 250,
                taxes: 20,
                debt: 0,
            },
            {
                id: 2,
                name: 'Clothing',
                totalAmount: 150,
                userId: 1,
                period: 'Week',
                startDate: '2024-11-01',
                lastMonthExpenses: 100,
                taxes: 15,
                debt: 10,
            },
            {
                id: 3,
                name: 'Education',
                totalAmount: 200,
                userId: 1,
                period: 'Month',
                startDate: '2024-11-01',
                lastMonthExpenses: 180,
                taxes: 30,
                debt: 20,
            },
            {
                id: 4,
                name: 'Transportation',
                totalAmount: 100,
                userId: 1,
                period: 'Day',
                startDate: '2024-11-01',
                lastMonthExpenses: 80,
                taxes: 5,
                debt: 0,
            },


        ]

        const defualtTransactions = [
            {
                id: 1,
                category: 'Transportation',
                name: 'Car',
                amount: -20,
                walletId: 1,
                date: '2024-01-01',
                desc: 'Grocery Items and Beverage soft drinks',
                currency: 'USD'
            },
            {
                id: 11,
                category: 'Income',
                name: 'Income',
                amount: 100,
                walletId: 1,
                date: '2024-01-01',
                desc: 'Income from work',
                currency: 'USD'
            },
            {
                id: 2,
                category: 'Grocery',
                name: 'Clothes',
                amount: -30,
                walletId: 2,
                date: '2024-02-01',
                desc: 'Grocery Items and Beverage soft drinks', currency: 'USD'
            },
            {
                id: 12,
                category: 'Income',
                name: 'Income',
                amount: 100,
                walletId: 1,
                date: '2024-02-01',
                desc: 'Project', currency: 'USD'
            },
            {
                id: 3,
                category: 'Education',
                name: 'Uni',
                amount: -50,
                walletId: 1,
                date: '2024-03-02',
                desc: 'Grocery Items and Beverage soft drinks', currency: 'USD'
            },
            {
                id: 13,
                category: 'Income',
                name: 'Income',
                amount: 150,
                walletId: 1,
                date: '2024-03-02',
                desc: 'Income', currency: 'USD'
            },
            {
                id: 4,
                category: 'Grocery',
                name: 'Restruraunt',
                amount: -10,
                walletId: 2,
                date: '2024-04-02',
                desc: 'Grocery Items and Beverage soft drinks', currency: 'USD'
            },
            {
                id: 14,
                category: 'Income',
                name: 'Income',
                amount: 100,
                walletId: 1,
                date: '2024-03-02',
                desc: 'Income', currency: 'USD'
            },
            {
                id: 5,
                category: 'Transportation',
                name: 'Gas',
                amount: -60,
                walletId: 1,
                date: '2024-05-03',
                desc: 'Grocery Items and Beverage soft drinks', currency: 'USD'
            },
            {
                id: 6,
                category: 'Clothing',
                name: 'Shopping',
                amount: -40,
                walletId: 2,
                date: '2024-06-03',
                desc: 'Grocery Items and Beverage soft drinks', currency: 'USD'
            },
            {
                id: 7,
                category: 'Grocery',
                name: 'Food',
                amount: -20,
                walletId: 1,
                date: '2024-07-04',
                desc: 'Grocery Items and Beverage soft drinks', currency: 'USD'
            },
            {
                id: 8,
                category: 'Grocery',
                name: 'Drinks',
                amount: -20,
                walletId: 2,
                date: '2024-08-04',
                desc: 'Grocery Items and Beverage soft drinks', currency: 'USD'
            },
            {
                id: 9,
                category: 'Grocery',
                name: 'Drinks',
                amount: 90,
                walletId: 1,
                date: '2024-09-04',
                desc: 'Grocery Items and Beverage soft drinks', currency: 'USD'
            },
            {
                id: 10,
                category: 'Grocery',
                name: 'Drinks',
                amount: 80,
                walletId: 2,
                date: '2024-10-04',
                desc: 'Grocery Items and Beverage soft drinks', currency: 'USD'
            },
            {
                id: 11,
                category: 'Income',
                name: 'Income',
                amount: 100,
                walletId: 1,
                date: '2024-11-06',
                desc: 'Income', currency: 'USD'
            },
            {
                id: 12,
                category: 'Grocery',
                name: 'Drinks',
                amount:200,
                walletId: 2,
                date: '2024-12-08',
                desc: 'Income', currency: 'USD'
            },


        ];



        const defualtGoals = [
            {
                id: 1,
                name: 'Car',
                walletId: 1,
                targetAmount: 50,
                currentAmount: 20,
                startDate: '2024-11-01',
                tagetDate: 250,
                status: 'active'
            },
            {
                id: 2,
                name: 'Watch',
                walletId: 2,
                targetAmount: 50,
                currentAmount: 20,
                startDate: '2024-11-01',
                tagetDate: 250,
                status: 'active'
            },
        ]

        const user = {
            userId,
            username,
            email,
            password,
            wallets: defaultWallets,
            budgets: defualtBudget,
            transactions: defualtTransactions,
            goals: defualtGoals
        };

        saveToLocalStorage('users', user);
        dispatch({ type: REDUCER_ACTION_TYPE.SIGN_UP, payload: user });
    };

    const logout = () => {
        dispatch({ type: REDUCER_ACTION_TYPE.LOGOUT });
    }

    const addWallet = (wallet: Wallet) => {
        dispatch({ type: REDUCER_ACTION_TYPE.ADD_WALLET, payload: wallet })
        const updatedUser = {
            ...state.user,
            wallets: [...state.user.wallets, wallet]
        }
        saveToLocalStorage('users', updatedUser)
    }
    const addBudget = (budget: Budget) => {
        dispatch({ type: REDUCER_ACTION_TYPE.ADD_BUDGET, payload: budget })
        const updatedUser = {
            ...state.user,
            budgets: [...state.user.budgets, budget]
        }
        saveToLocalStorage('users', updatedUser)
    }
    const addGoal = (goal: Goal) => {
        dispatch({ type: REDUCER_ACTION_TYPE.ADD_GOAL, payload: goal })
        const updatedUser = {
            ...state.user,
            goals: [...state.user.goals, goal]
        }
        saveToLocalStorage('users', updatedUser)
    }
    const addTransaction = (transaction: Transaction) => {
            const updatedWallets = state?.user.wallets.map((wallet: Wallet) => {
                if (wallet.id == transaction.walletId) {
                    return {
                        ...wallet,
                        balance: wallet.balance + transaction.amount
                    }
                }
                return wallet
            })
            dispatch({
                type: REDUCER_ACTION_TYPE.ADD_TRANSACTION,
                payload: transaction,
            });
            const updateUser = {
                ...state.user,
                wallets: updatedWallets,
                transactions: [...state.user.transactions, transaction]
            }
            saveToLocalStorage('users', updateUser)   
    };
    const removeWallet = (id: number) => {
        dispatch({ type: REDUCER_ACTION_TYPE.REMOVE_WALLET, payload: id })
        const updatedUser = {
            ...state.user,
            wallets: state.user.wallets.filter((wallet: Wallet) => wallet.id !== id)
        }
        saveToLocalStorage('users', updatedUser)
    }
    const removeBudget = (id: number) => {
        dispatch({ type: REDUCER_ACTION_TYPE.REMOVE_BUDGET, payload: id })
        const updatedUser = {
            ...state.user,
            wallets: state.user.budgets.filter((budget: Budget) => budget.id !== id)
        }
        saveToLocalStorage('users', updatedUser)
    }
    const removeGoal = (id: number) => {
        dispatch({ type: REDUCER_ACTION_TYPE.REMOVE_GOAL, payload: id })
        const updatedUser = {
            ...state.user,
            goals: state.user.goals.filter((goal: Goal) => goal.id !== id)
        }
        saveToLocalStorage('users', updatedUser)
    }
    const removeTransaction = (id: number) => {
        dispatch({ type: REDUCER_ACTION_TYPE.REMOVE_TRANSACTION, payload: id })
        const updatedUser = {
            ...state.user,
            transactions: state.user.transactions.filter((transaction: Budget) => transaction.id !== id)
        }
        saveToLocalStorage('users', updatedUser)
    }

    const getWalletById = (id: number): Wallet | undefined => {
        dispatch({ type: REDUCER_ACTION_TYPE.GET_WALLET_BY_ID, payload: id })
        const wallet = state.user?.wallets.find((wallet: Wallet) => wallet.id == id)
        return wallet
    }
    const getBudgetById = (id: number): Budget | undefined => {
        dispatch({ type: REDUCER_ACTION_TYPE.GET_BUDGET_BY_ID, payload: id })
        const budget = state.user?.budgets.find((budget: Budget) => budget.id == id)
        return budget
    }
    const getGoalById = (id: number): Goal | undefined => {
        dispatch({ type: REDUCER_ACTION_TYPE.GET_GOAL_BY_ID, payload: id })
        const goal = state.user?.goals.find((goal: Goal) => goal.id == id)
        return goal
    }
    return {
        state, signIn, signUp, logout, fetchItems, addWallet,
        removeWallet, getWalletById, addBudget, getBudgetById,
        removeBudget, addTransaction, removeTransaction,
        addGoal, removeGoal, getGoalById
    };
}

type MainContextType = ReturnType<typeof useMainContext>;

const initialContextState: MainContextType = {
    state: initialAuthState,
    signIn: async () => { },
    signUp: async () => { },
    logout: () => { },
    fetchItems: async () => { },
    addWallet: async () => { },
    removeWallet: async () => { },
    getWalletById: (id: number) => undefined,
    addBudget: async () => { },
    removeBudget: async () => { },
    getBudgetById: (id: number) => undefined,
    addTransaction: async () => { },
    removeTransaction: async () => { },
    addGoal: async () => { },
    removeGoal: async () => { },
    getGoalById: (id: number) => undefined,
}

export const MainContext = createContext<MainContextType>(initialContextState);

type AuthProviderProps = { children: ReactNode }

export const AuthProvider = ({ children }: AuthProviderProps): ReactElement => {
    const mainContextValue = useMainContext();

    return (
        <MainContext.Provider value={mainContextValue}>
            {children}
        </MainContext.Provider>
    );
}
