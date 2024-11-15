
import {
  Box, Typography, Snackbar, Alert, Select,
  Grid, Button, MenuItem, OutlinedInput, TextField,
  Tooltip, SelectChangeEvent,
  LinearProgress, CircularProgress,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { Layout } from '../Layout'
import { useLocation } from 'react-router-dom'
import { Heading } from '../components/Heading'
import { MainContext } from '../context/mainContext'
import { AccountBalance, Add, Delete, WalletOutlined, WalletSharp } from '@mui/icons-material'
import AppModal from '../components/modal/AppModal'
import DeleteModal from '../components/modal/DeleteModal'
import { Transaction, Budget, Goal, Wallet } from "../types/types";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CalendarIcon } from '@mui/x-date-pickers/icons'


export const Goals = () => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false);
  const { state, fetchItems, addGoal, removeGoal, getGoalById } = useContext(MainContext);
  const [singleGoal, setSingleGoal] = useState<Goal | null>(state?.user?.goals[0]);
  const [goalName, setGoalName] = useState<string>('')
  const [walletId, setWalletId] = useState(0)
  const [targetAmount, setTargetAmount] = useState(0)
  const [currentAmount, setCurrentAmount] = useState(0)
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs('2022-04-17'))
  const [targetDate, setTargetDate] = useState<Dayjs | null>(dayjs('2022-04-17'))
  const [isOpenNotification, setIsOpenNotification] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<number>(1)

  useEffect(() => {
    fetchItems('users')
  }, [])


  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
  };
  const percentageGoal = (Math.abs(singleGoal?.currentAmount || 1) / (singleGoal?.targetAmount || 1)) * 100;

  const roundedPercentageGoal = Math.round(percentageGoal);

  const roundedRemainingPercentage = Math.round(100 - percentageGoal);

  const filteredTransactions = state.user?.transactions?.filter((trans: Transaction) => trans?.amount > 0)

  const allTotalTransactions = state?.user?.transactions
    .filter((transaction: Transaction) => transaction.amount < 0)
    .reduce((sum: number, transaction: Transaction) => sum + transaction.amount, 0);

  const allDebtTransactions = state?.user?.budgets
    .reduce((sum: number, budget: Budget) => sum + budget.debt, 0);

  const allTaxTransactions = state?.user?.budgets
    .reduce((sum: number, budget: Budget) => sum + budget.taxes, 0);

  const getEachTransaction = (id: number) => {
    const totalTransactions = state?.user?.transactions
      .filter((transaction: Transaction) => transaction?.walletId === id)
      .reduce((sum: number, transaction: Transaction) => sum + transaction.amount, 0);

    return totalTransactions;
  };

  const calculateProgress = (wallet: Wallet) => {
    const totalTransactions = getEachTransaction(wallet.id);
    const balance = wallet.balance || 0;
    console.log((totalTransactions / balance) * 100);

    return balance > 0 ? (Math.abs(totalTransactions) / balance) * 100 : 0;
  }

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const addSingleGoal = () => {
    const newGoal: Goal = {
      id: state.user?.goals.length + 1,
      name: goalName,
      walletId: walletId,
      targetAmount: targetAmount,
      currentAmount: currentAmount,
      startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
      targetDate: targetDate ? targetDate.format('YYYY-MM-DD') : null,

    }
    if (goalName && walletId && targetAmount && currentAmount && startDate && targetDate) {
      addGoal(newGoal)
      setIsOpen(false);
      setGoalName('')
      setWalletId(0)
      setTargetAmount(0)
      setCurrentAmount(0)
      setStartDate(null)
      setTargetDate(null)
    }
    else {
      setIsOpenNotification(true)
    }
  };

  const handleDelete = (): void => {
    setIsDeleteModalOpen(true)
  }

  const removeEachGoal = (id: number) => {
    removeGoal(id)
    setIsDeleteModalOpen(false)
  }
  const handleCloseNotification = () => {
    setIsOpenNotification(false)
  }

  const handleChangeWalletId = (event: SelectChangeEvent) => {
    setWalletId(Number(event.target.value))
  }

  const getWalletName = (id: number) => {
    const targetWallet = state?.user?.wallets.find((wallet: Wallet) => wallet.id == id)
    return targetWallet?.name
  }

  const getEachGoal = (id: number) => {

    const goal = getGoalById(id)
    if (goal) {
      if (singleGoal?.id !== id) {
        setSingleGoal(goal);
        setSelectedGoal(id);
      }
    } else {
      setSingleGoal(null);
    }
  }

  return (
    <Layout>
      <Box sx={{ width: 500 }}>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isOpenNotification}
          autoHideDuration={1200}
        >
          <Alert
            onClose={handleCloseNotification}
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
          >
            Please set all field!
          </Alert>
        </Snackbar>
      </Box>
      <AppModal
        open={isOpen}
        onOpen={handleOpen}
        onClose={handleClose}
        onSubmit={addSingleGoal}
        headerContent="Add Budget"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            margin="normal"
            fullWidth
            placeholder='goalName'
            value={goalName || ''}
            onChange={(e) => setGoalName(e.target.value)}
            sx={inputStyle}
          />

          <Select
            labelId="demo-simple-select-label"
            required
            id="demo-simple-select"
            label="Period"
            value={walletId || ''}
            onChange={handleChangeWalletId}
            MenuProps={{
              PaperProps: {
                style: { backgroundColor: "#131129", color: 'white', border: 'none' },
              },
            }}
            sx={inputStyle}
            displayEmpty
            input={<OutlinedInput />}
          >
            <MenuItem value="" disabled>
              wallet
            </MenuItem>

            {state?.user?.wallets?.map((wallet: Wallet) => (
              <MenuItem
                key={wallet?.id}
                value={wallet?.id}
                sx={{ color: '#aea9e4', '&:hover': { backgroundColor: '#2f2b43' } }}
              >
                {wallet?.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            margin="normal"
            fullWidth
            placeholder='Target Amount'
            value={targetAmount || ''}
            onChange={(e) => setTargetAmount(Number(e.target.value))}
            sx={inputStyle}
          />
          <TextField
            margin="normal"
            fullWidth
            placeholder='Current Amount'
            value={currentAmount || ''}
            onChange={(e) => setCurrentAmount(Number(e.target.value))}
            sx={inputStyle}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="set start date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              sx={inputStyle}
              slotProps={{
                layout: {
                  sx: {
                    color: 'black',
                    fontWeight: '600',
                    borderRadius: '5px',
                    border: '2px solid #2f2b43',
                    backgroundColor: '#AD49E1',
                  }
                }
              }} />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="set current date"
              value={startDate}
              onChange={(newValue) => setTargetDate(newValue)}
              sx={inputStyle}
              slotProps={{
                layout: {
                  sx: {
                    color: 'black',
                    fontWeight: '600',
                    borderRadius: '5px',
                    border: '2px solid #2f2b43',
                    backgroundColor: '#AD49E1',
                  }
                }
              }} />
          </LocalizationProvider>
          <Button
            variant="contained"
            color="primary"
            onClick={addSingleGoal}
            sx={{
              bgcolor: '#AD49E1'
              , fontWeight: 'bold'
              , width: '100%'
              , '&:hover': {
                bgcolor: '#9C3BCF',
                animation: '0.5s ease-in-out'
              }
            }}
          >
            Add Goal
          </Button>
        </Box>
      </AppModal>
      < Heading location={location} />
      <Grid container spacing={4} mt={2} mb={6}>
        <Grid item xs={12} md={4} >
          {
            state?.user?.goals?.map((goal: Goal) => (
              <Grid fontSize='18px' mb={2} borderRadius='5px' gap={2} display='flex' justifyContent='space-between'
                bgcolor={selectedGoal == goal.id ? '#7A1CAC' : '#1d1933'} border={selectedGoal == goal.id ? 'none' : '2px solid #2f2b43'}
                height='100' p={2}
              >
                <Box display='flex' sx={{ cursor: 'pointer' }} gap={2} onClick={() => getEachGoal(goal.id)}>
                  <DeleteModal
                    open={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onSubmit={() => removeEachGoal(goal?.id)}
                  >
                    <Box>
                      Are You sure you want to delete goal?
                    </Box>
                  </DeleteModal>
                  <Box position="relative" display="inline-flex">
                    <CircularProgress
                      variant="determinate"
                      value={100}
                      size={50}
                      thickness={4}
                      style={{ color: 'white' }}
                    />
                    <CircularProgress
                      variant="determinate"
                      value={
                        (goal?.targetAmount ?? 0) > 0
                          ? (((goal?.targetAmount ?? 0) - (goal?.currentAmount ?? 0)) / (goal?.targetAmount ?? 1)) * 100
                          : 0
                      }
                      size={50}
                      thickness={4}
                      style={{ color: '#51bb25', position: 'absolute', left: 0 }}
                    />
                    <Box
                      top={0}
                      left={0}
                      bottom={7}
                      right={0}
                      position="absolute"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography
                        variant="h6"
                        component="div"
                        color="#51bb25"
                        fontSize={10}
                        textAlign="center"
                      >
                        {`${(goal?.targetAmount ?? 0) > 0
                          ? Math.round((((goal?.targetAmount ?? 0) - (goal?.currentAmount ?? 0)) / (goal?.targetAmount ?? 1)) * 100)
                          : 0}%`}
                      </Typography>
                    </Box>
                  </Box>
                  <Box >
                    <Typography variant="subtitle1" color='white' fontWeight='600'>
                      {goal.name}
                    </Typography>
                    <Box display='flex'>
                      <Typography variant="subtitle1" fontWeight='600' color={selectedGoal == goal.id ? 'white' : '#a171ad'}>
                        $ {goal?.currentAmount}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight='600' mx={1} color={selectedGoal == goal.id ? 'white' : '#a171ad'}>
                        /
                      </Typography>
                      <Typography variant="subtitle1" fontWeight='600' color={selectedGoal == goal.id ? 'white' : '#a171ad'}>
                        $ {goal?.targetAmount}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <Box>
                    <Tooltip title='Remove Item'>
                      <Delete sx={{ color: '#a171ad', cursor: 'pointer' }} onClick={handleDelete} />
                    </Tooltip>
                  </Box>
                </Box>
              </Grid>
            ))
          }
          <Box border='2px solid #2f2b43' gap={2} display='flex' justifyContent='space-between' mb={2} borderRadius='5px' bgcolor='#1d1933' height='100' p={2}>
            <Box>
              <Typography color='white' fontWeight='600'>
                Add new Goal
              </Typography>
            </Box>
            <Box >
              <Add sx={{ color: '#7A1CAC', border: '2px solid #7A1CAC', cursor: 'pointer', fontSize: '0.9rem' }} onClick={handleOpen} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={8} spacing={3} gap={3}>
          <Box border='2px solid #2f2b43' height='70px' p={2} borderRadius='5px' bgcolor='#1d1933' color='white' mb={3}>
            <Typography fontSize='19px' fontWeight='600'>
              {singleGoal?.name}
            </Typography>
          </Box>

          <Grid container >
            <Grid item xs={12} md={12} >
              <Box border='2px solid #2f2b43' height='150px' p={3} gap={2}
                borderRadius='5px' bgcolor='#1d1933' color='white' mb={3} justifyContent='center' alignItems='center' >
                <Grid display='flex' justifyContent='space-between' spacing={2}>
                  <Box height={20} mb={1}>
                    <Typography fontSize='14px'>
                      Saved
                    </Typography>
                    <Typography fontSize='22px'>
                      {singleGoal?.currentAmount} $
                    </Typography>
                  </Box>
                  <Box height={20} mb={1}>
                    <Typography fontSize='14px'>
                      Goal
                    </Typography>
                    <Typography fontSize='22px'>
                      {singleGoal?.targetAmount} $
                    </Typography>
                  </Box>
                </Grid>
                <Box height={80} mt={4} mb={1}>
                  <LinearProgress variant='determinate' value={percentageGoal} sx={{
                    height: '15px',
                    marginBottom: '1px',
                    borderRadius: '5px',
                    backgroundColor: 'lightgray',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#7A1CAC'
                    },
                  }} />

                  <Grid display='flex' justifyContent='space-between' mt={1} p={0}>
                    <Box >
                      <Typography fontSize='14px'>
                        {roundedPercentageGoal} %
                      </Typography>
                    </Box>
                    <Box>
                      <Typography fontSize='14px'>
                        <Typography fontSize='14px'>
                          {roundedRemainingPercentage} %
                        </Typography>
                      </Typography>
                    </Box>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Grid border='2px solid #2f2b43' display='flex' height='130px' p={2} borderRadius='5px' bgcolor='#1d1933' mb={3}>
            <Box flex={1} mx={1} textAlign='center' >
              <Typography fontSize='15px' fontWeight='600' color='#EBD3F8'>
                Expenses
              </Typography>
              <Typography fontSize='21px' fontWeight='600' color='white' mt={3}>
                $ {Math.abs(allTotalTransactions)}
              </Typography>
            </Box>
            <Box flex={1} mx={1} textAlign='center' color='#EBD3F8'>
              <Typography fontSize='15px' fontWeight='600'>
                Taxes
              </Typography>
              <Typography fontSize='21px' fontWeight='600' color='white' mt={3}>
                $ {allTaxTransactions}
              </Typography>
            </Box>
            <Box flex={1} mx={1} textAlign='center' color='#EBD3F8'>
              <Typography fontSize='15px' fontWeight='600'>
                Debts
              </Typography>
              <Typography fontSize='21px' fontWeight='600' color='white' mt={3}>
                $ {allDebtTransactions}
              </Typography>
            </Box>
          </Grid>
          <Grid display='flex' gap={2} flexDirection='column' border='2px solid #2f2b43' height='auto' p={2} borderRadius='5px' bgcolor='#1d1933' mb={3}>
            <Box flex={1}>
              <Typography color='white'>
                Available by Wallet
              </Typography>
            </Box>
            {state?.user?.wallets.map((wallet: Wallet) =>
              <Grid container height={40} mb={1} flex={1} gap={2}  >
                <Box display="flex" alignItems="center">
                  {
                    wallet.type == 'Cash' ?
                      <WalletSharp sx={{ bgcolor: '#ffee58', borderRadius: '50%', p: 1, fontSize: '2.5rem', color: 'white' }} />
                      :
                      <AccountBalance sx={{ bgcolor: '#ff1744', borderRadius: '50%', p: 1, fontSize: '2.5rem', color: 'white' }} />
                  }
                </Box>
                <Box flexGrow={1} display="flex" flexDirection="column" justifyContent="center">
                  <Box display='flex' justifyContent='space-between'>
                    <Typography color='white' fontWeight={600}>
                      {wallet?.name}
                    </Typography>
                    <Typography color='#aea9e4' fontWeight={600}>
                      {wallet?.balance} $
                    </Typography>
                  </Box>
                  <LinearProgress variant='determinate' value={calculateProgress(wallet)}
                    sx={{
                      height: '10px',
                      marginTop: 1,
                      marginBottom: '1px',
                      borderRadius: '5px',
                      backgroundColor: 'lightgray',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: `${wallet?.type == 'Cash' ? '#ffee58' : '#ff1744'}`
                      },
                    }} />
                </Box>

              </Grid>
            )
            }
          </Grid>
          <Box border='2px solid #2f2b43' p={2}
            borderRadius='5px' bgcolor='#1d1933' color='white' mb={3} justifyContent='center' alignItems='center' >
            <Typography variant='h6' fontWeight='600'>
              Transaction Saving History
            </Typography>
            <TableContainer sx={{ backgroundColor: '#1d1933' }} >
              <Table>
                <TableHead >
                  <TableRow >
                    <TableCell sx={{ color: 'white', fontWeight: '600' }}>Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: '600' }}>Wallet</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: '600' }}>Desc</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: '600' }}>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions?.map((row: Transaction) => (
                    <TableRow key={row.id} sx={{

                      '&:last-child td, &:last-child th': {
                        border: 'none',
                      },
                    }}>
                      <TableCell sx={{
                        color: '#aea9e4',
                        borderBottom: '1px solid #aea9e42b',

                      }} >
                        <Box sx={{ display: 'flex', }}>
                          <Typography mr={1}>
                            <CalendarIcon sx={{ color: '#aea9e4' }} />
                          </Typography>
                          <Typography>
                            {row.date}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{
                        color: '#aea9e4',
                        borderBottom: '1px solid #aea9e42b',
                      }}>
                        <Box sx={{ display: 'flex', }}>
                          <Typography mr={1}>
                            <WalletOutlined sx={{ color: '#aea9e4' }} />
                          </Typography>
                          <Typography>
                            {
                              getWalletName(row?.walletId)
                            }
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{
                        color: '#aea9e4',
                        borderBottom: '1px solid #aea9e42b',
                      }}>{row?.desc}</TableCell>
                      <TableCell sx={{
                        color: '#aea9e4',
                        borderBottom: '1px solid #aea9e42b',
                      }}>
                        <Box sx={{}}>
                          <Typography mr={1} fontWeight={600} color='white'>
                            +50 $
                          </Typography>
                          <Typography>
                            {row.amount} $
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </Layout >
  )
}

const inputStyle = {
  background: '#131129',
  margin: 0,
  color: '#aea9e4',
  border: '2px solid #2f2b43',
  borderRadius: '5px',
  '& .MuiInputBase-input': {
    color: '#aea9e4',
    fontSize: '0.9rem',
  },
  '& .MuiInputLabel-root': {
    color: '#aea9e4',
    fontSize: '0.9rem',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: 'transparent',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#AD49E1 !important',
    },
  },
  '& .MuiSelect-select:focus': {
    backgroundColor: '#131129',
    borderColor: '#AD49E1',
    boxShadow: '0 0 0 1px rgba(173, 73, 225, 0.5)',
  },
  '& .MuiSelect-select': {
    padding: '10px',
    color: '#aea9e4',
  },
  '&:focus .MuiOutlinedInput-notchedOutline': {
    borderColor: '#AD49E1',
    boxShadow: 'none',
  },
  '&.MuiOutlinedInput-root': {
    '& fieldset': {
    },
    '&.Mui-focused fieldset': {
      borderColor: '#AD49E1',
      boxShadow: 'none',
    },
  },

  '& .MuiSvgIcon-root': {
    color: '#aea9e4',
  },


};
