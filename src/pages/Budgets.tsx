
import {
  Box, Typography, Snackbar, Alert, Select, Grid, Button,
  MenuItem, OutlinedInput, TextField, Stack, Tooltip,
  SelectChangeEvent, LinearProgress
} from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { Layout } from '../Layout'
import { useLocation } from 'react-router-dom'
import { Heading } from '../components/Heading'
import { MainContext } from '../context/mainContext'
import { AccountBalance, Add, Delete } from '@mui/icons-material'
import AppModal from '../components/modal/AppModal'
import DeleteModal from '../components/modal/DeleteModal'
import { LineChart } from '@mui/x-charts/LineChart'
import { Transaction, Budget } from "../types/types";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export const Budgets = () => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false);
  const { state, fetchItems, addBudget, removeBudget, getBudgetById } = useContext(MainContext);
  const [budgetName, setBudgetName] = useState<string>('')
  const [category, setCategory] = useState('')
  const [totalAmount, setTotalAmount] = useState(0)
  const [period, setPeriod] = useState('')
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs('2022-04-17'))
  const [lastMonthExpenses, setLastMonthExpenses] = useState(0)
  const [taxes, setTaxes] = useState(0)
  const [debt, setDebt] = useState(0)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [singlebudget, setSinglebudget] = useState<Budget | null>(state?.user?.budgets[0]);
  const [selectedBudget, setselectedBudget] = useState<number>(1)
  const [isOpenNotification, setIsOpenNotification] = useState(false)


  useEffect(() => {
    fetchItems('users')
  }, [])


  interface BudgetAmountDataPoint {
    date: Date,
    amount: number,
  }

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  const totalSpent = state?.user?.transactions
    .filter((transaction: Transaction) => transaction?.category === singlebudget?.name)
    .reduce((sum: number, transaction: Transaction) => sum + transaction.amount, 0);

  const filteredTransactions = state.user?.transactions?.filter((trans: Transaction) => trans?.category == singlebudget?.name)
  const xData = filteredTransactions?.map((trans: Transaction) => { return trans?.date })

  let currentBalance = singlebudget?.totalAmount || 0

  const budgetData = xData?.map((date: string, index: number) => {
    const transactionAmount = filteredTransactions[index]?.amount || 0
    currentBalance += transactionAmount
    return {
      date,
      amount: currentBalance
    }

  })

  const remainingAmount = (singlebudget?.totalAmount || 0) - totalSpent;
  const percentageSpent = (Math.abs(totalSpent) / (singlebudget?.totalAmount || 1)) * 100;

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const addSinglebudget = () => {
    const newbudget: Budget = {
      id: state.user?.budgets.length + 1,
      name: budgetName,
      totalAmount: totalAmount,
      period: period,
      startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
      lastMonthExpenses: lastMonthExpenses,
      taxes: taxes,
      debt: debt,
    }
    if (budgetName && totalAmount && period && startDate && taxes && debt) {
      addBudget(newbudget)
      setIsOpen(false);
      setBudgetName('')
      setTotalAmount(0)
      setPeriod('')
      setStartDate(null)
      setLastMonthExpenses(0)
    }
    else {
      setIsOpenNotification(true)
    }
  };

  const handleDelete = (): void => {
    setIsDeleteModalOpen(true)
  }

  const removeEachbudget = (id: number) => {
    removeBudget(id)
    setIsDeleteModalOpen(false)
  }

  const handleChangePeriod = (event: SelectChangeEvent) => {
    setPeriod(event.target.value)
  }

  const handleCloseNotification = () => {
    setIsOpenNotification(false)
  }

  const getEachbudget = (id: number) => {
    const budget = getBudgetById(id)
    if (budget) {
      if (singlebudget?.id !== id) {
        setSinglebudget(budget);
        setselectedBudget(id);
      }
    } else {
      setSinglebudget(null);
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
        onSubmit={addSinglebudget}
        headerContent="Add Budget"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            margin="normal"
            fullWidth
            placeholder='budgetName'
            value={budgetName || ''}
            onChange={(e) => setBudgetName(e.target.value)}
            sx={inputStyle}
          />
          <TextField
            margin="normal"
            fullWidth
            placeholder='Category'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={inputStyle}
          />

          <TextField
            margin="normal"
            fullWidth
            placeholder='totalAmount'
            value={totalAmount || ''}
            onChange={(e) => setTotalAmount(Number(e.target.value))}
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
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Period"
            value={period || ''}
            onChange={handleChangePeriod}
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
              Period
            </MenuItem>

            {state?.user?.budgets?.map((budg: Budget) => (
              <MenuItem
                key={budg?.id}
                value={budg?.period}
                sx={{ color: '#aea9e4', '&:hover': { backgroundColor: '#2f2b43' } }}
              >
                {budg?.period}
              </MenuItem>
            ))}
          </Select>

          <TextField
            margin="normal"
            fullWidth
            placeholder='debt'
            value={debt || ''}
            onChange={(e) => setDebt(Number(e.target.value))}
            sx={inputStyle}
          />

          <TextField
            margin="normal"
            fullWidth
            placeholder='tax'
            value={taxes || ''}
            onChange={(e) => setTaxes(Number(e.target.value))}
            sx={inputStyle}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={addSinglebudget}
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
            Add budget
          </Button>
        </Box>
      </AppModal>

      < Heading location={location} />
      <Grid container spacing={4} mt={2} mb={6}>
        <Grid item xs={12} md={4} >
          {
            state.user?.budgets?.map((budget: Budget) => (
              <Grid fontSize='18px' mb={2} borderRadius='5px' gap={2} display='flex' justifyContent='space-between'
                bgcolor={selectedBudget == budget.id ? '#7A1CAC' : '#1d1933'} border={selectedBudget == budget.id ? 'none' : '2px solid #2f2b43'}
                height='100' p={2}
              >
                <Box display='flex' sx={{ cursor: 'pointer' }} gap={2} onClick={() => getEachbudget(budget.id)}>
                  <DeleteModal
                    open={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onSubmit={() => removeEachbudget(budget?.id)}
                  >
                    <Box>
                      Are You sure you want to delete budget?
                    </Box>
                  </DeleteModal>
                  <Box>
                    <AccountBalance sx={{ bgcolor: '#f4e1f9', borderRadius: '50%', p: 1, fontSize: '2.5rem', color: '#7A1CAC' }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" color='white' fontWeight='600'>
                      {budget.name}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight='600' color={selectedBudget == budget.id ? 'white' : '#a171ad'}>
                      $ {budget.totalAmount}
                    </Typography>
                    <Typography color={selectedBudget == budget.id ? 'white' : '#a171ad'} fontWeight={600} fontSize='13px'>
                      {budget.period}
                    </Typography>
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
                Add new budget
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
              {singlebudget?.name}
            </Typography>
          </Box>
          <Grid container >
            <Grid item xs={12} md={12} >
              <Box border='2px solid #2f2b43' height='150px' p={3} gap={2}
                borderRadius='5px' bgcolor='#1d1933' color='white' mb={3} justifyContent='center' alignItems='center' >
                <Grid display='flex' justifyContent='space-between' spacing={2}>
                  <Box height={20} mb={1}>
                    <Typography fontSize='14px'>
                      Expense
                    </Typography>
                    <Typography fontSize='22px'>
                      {Math.abs(totalSpent)} $
                    </Typography>

                  </Box>
                  <Box height={20} mb={1}>
                    <Typography fontSize='14px'>
                      Budget
                    </Typography>
                    <Typography fontSize='22px'>
                      {singlebudget?.totalAmount} $
                    </Typography>

                  </Box>
                </Grid>
                <Box height={80} mt={4} mb={1}>
                  <LinearProgress variant='determinate' value={percentageSpent} sx={{
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
                        {percentageSpent.toFixed(2)} %
                      </Typography>
                    </Box>
                    <Box>
                      <Typography fontSize='14px'>
                        <Typography fontSize='14px'>
                          {(100 - percentageSpent).toFixed(2)} %
                        </Typography>
                      </Typography>
                    </Box>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* chart */}
          <Box style={{ backgroundColor: '#1d1933', height: '350px' }} borderRadius='5px' my={3} border='2px solid #2f2b43'  >
            <Stack sx={{ width: '100%' }} p={2}>
              <LineChart
                xAxis={[{
                  data: budgetData?.map((point: BudgetAmountDataPoint) => {
                    const date = new Date(point.date);
                    return formatDate(date);
                  }),
                  scaleType: 'point',
                  tickLabelStyle: {
                    fill: '#9771ad8a'
                  },
                  labelStyle: {
                    fill: '#9771ad8a'
                  }
                }
                ]}
                series={[{
                  curve: "linear",
                  data: budgetData?.map((point: BudgetAmountDataPoint) => point?.amount),
                  label: 'remaining budget:',
                  connectNulls: true, area: true, color: '#EBD3F8',
                },
                ]}
                yAxis={[{
                  tickLabelStyle: {
                    fill: '#9771ad8a'
                  },
                  labelStyle: {
                    fill: '#9771ad8a'
                  }
                }]}
                height={300}
                margin={{ top: 10, bottom: 20 }}
                colors={['#AD49E1', '#b76dde']}
                slotProps={{ legend: { hidden: true } }}
                sx={{
                  '& .MuiLineElement-root': {
                    stroke: '#AD49E1',
                    strokeWidth: 4,
                  },

                  '& .MuiAreaElement-root': {
                    fill: '#aea9e480'

                  },
                  '& .MuiMarkElement-root': {
                    stroke: '#b76dde',
                    fill: '#AD49E1',

                  },
                  '& .MuiMarkElement-highlighted': {
                    stroke: '#b76dde',
                    fill: '#AD49E1',
                  },

                  '& .MuiLineElement-faded': {
                    stroke: '#b76dde',
                    fill: '#AD49E1',
                  },
                }}
              />
            </Stack>
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
