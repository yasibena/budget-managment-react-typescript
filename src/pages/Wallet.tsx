import {
  Box, OutlinedInput, Typography, Alert, Snackbar,
  Select, Grid, Button, MenuItem, TextField, Stack,
  Tooltip, SelectChangeEvent, Divider, FormControl,
  FormLabel, RadioGroup, FormControlLabel, Radio
} from '@mui/material'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { Layout } from '../Layout'
import { useLocation } from 'react-router-dom'
import { Heading } from '../components/Heading'
import { MainContext } from '../context/mainContext'
import { AccountBalance, Add, Delete, WalletSharp } from '@mui/icons-material'
import AppModal from '../components/modal/AppModal'
import DeleteModal from '../components/modal/DeleteModal'
import { LineChart } from '@mui/x-charts/LineChart'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Wallet, Transaction, Goal } from "../types/types";
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

export const Wallets = () => {
  const location = useLocation()
  const [isOpenٌWallet, setIsOpenٌWallet] = useState(false);
  const [isOpenTransaction, setIsOpenٌTransaction] = useState(false);
  const { state, fetchItems, addWallet, removeWallet, getWalletById, addTransaction } = useContext(MainContext);
  const [walletName, setWalletName] = useState<string>('')
  const [balance, setBalance] = useState(0)
  const [walletType, setWalletType] = useState<string>('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [singleWallet, setSingleWallet] = useState<Wallet | null>(state?.user?.wallets[0]);
  const [transactionName, setTransactionName] = useState('')
  const [category, setCategory] = useState('')
  const [transactionDate, setTransactionDate] = useState<Dayjs | null>(dayjs(''))
  const [desc, setDesc] = useState('')
  const [transactionAmount, setTransactionAmount] = useState(0)
  const [walletTransactionId, setWalletTransactionId] = useState(0)
  const [selectedWallet, setSelectedWallet] = useState<number>(1)
  const [isOpenNotification, setIsOpenNotification] = useState(false)
  const [goal, setGoal] = useState(0)
  const [transactionTypes] = useState(['Save', 'Expense', 'Income'])
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchItems('users')
  }, [])

  interface BalanceDataPoint {
    date: Date,
    balance: number,
  }

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  const filteredTransactions = state.user?.transactions?.filter((trans: Transaction) => trans?.walletId == singleWallet?.id)
  const xData = filteredTransactions?.map((trans: Transaction) => { return trans?.date })

  let currentBalance = singleWallet?.balance || 0

  const balanceData = xData?.map((date: string, index: number) => {
    const transactionAmount = filteredTransactions[index]?.amount || 0
    currentBalance += transactionAmount
    return {
      date,
      balance: currentBalance
    }


  })

  const totalTransactions = state?.user?.transactions
    .filter((transaction: Transaction) => transaction?.walletId === singleWallet?.id)
    .reduce((sum: number, transaction: Transaction) => sum + transaction.amount, 0);

  const personalFunds = (singleWallet?.balance || 0) + (singleWallet?.creditLimit || 0) + totalTransactions;

  const handleChangeCategory = (event: SelectChangeEvent) => {
    setCategory(event?.target.value)
  }

  const handleOpenWallet = () => setIsOpenٌWallet(true);
  const handleCloseWallet = () => setIsOpenٌWallet(false);
  const handleOpenTransaction = () => setIsOpenٌTransaction(true);
  const handleCloseTransaction = () => setIsOpenٌTransaction(false);

  const addSingleWallet = () => {
    const newWallet: Wallet = {
      id: state.user?.wallets.length + 1,
      name: walletName,
      type: walletType,
      balance: balance,
      currency: 'USD',
      creditLimit: 200
    }
    if (walletName && walletType && balance) {
      addWallet(newWallet)
      setIsOpenٌWallet(false);
      setWalletName('')
      setBalance(0)
      setWalletType('Bank')
    }
    else {
      setIsOpenNotification(true)
    }


  };
  const addSingleTransaction = () => {
    const newTransaction: Transaction = {
      id: state.user?.transactions.length + 1,
      name: transactionName,
      category: category,
      date: transactionDate ? transactionDate.format('YYYY-MM-DD') : null,
      desc: desc,
      amount: transactionAmount,
      currency: 'USD',
      walletId: walletTransactionId,
      goalId: goal
    }
    if (transactionName && category && transactionDate && desc && transactionAmount && walletTransactionId) {
      addTransaction(newTransaction)
      setIsOpenٌTransaction(false)
      setTransactionName('')
      setCategory('')
      setTransactionDate(null)
      setDesc('')
      setTransactionAmount(0)
      setWalletTransactionId(0);
    }
    else {
      setIsOpenNotification(true)
    }
  };

  const handleDelete = (): void => {
    setIsDeleteModalOpen(true)
  }

  const removeEachWallet = (id: number) => {
    removeWallet(id)
    setIsDeleteModalOpen(false)
  }

  const handleChangeType = (event: SelectChangeEvent) => {
    setWalletType(event.target.value)
  }
  const handleChangeGoal = (event: SelectChangeEvent) => {
    setGoal(Number(event.target.value))
  }

  const handleChangeWalletTransactionId = (event: SelectChangeEvent) => {
    setWalletTransactionId(Number(event.target.value))
  }

  const handleCloseNotification = () => {
    setIsOpenNotification(false)
  }

  const handleTrasnactionAmount = (event: ChangeEvent<HTMLInputElement>) => {
    if (value == "Save" || value == "Income") {
      setTransactionAmount(Number(event.target.value))
    }
    if (value == "Expense") {
      setTransactionAmount(-Math.abs(Number(event.target.value)))
    }
  }

  const getEachWallet = (id: number) => {
    const wallet = getWalletById(id)
    if (wallet) {
      if (singleWallet?.id !== id) {
        setSingleWallet(wallet);
        setSelectedWallet(id);
      }
    } else {
      setSingleWallet(null);
    }

  }

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setError(false);
  };

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
        open={isOpenٌWallet}
        onOpen={handleOpenWallet}
        onClose={handleCloseWallet}
        onSubmit={addSingleWallet}
        headerContent="Add Wallet"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            placeholder='WalletName'
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
            sx={inputStyle}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            placeholder='Balance'
            value={balance || ''}
            onChange={(e) => setBalance(Number(e.target.value))}
            sx={inputStyle}
          />
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            required
            value={walletType || ''}
            onChange={handleChangeType}
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
              Category
            </MenuItem>
            <MenuItem value="Bank" sx={{ color: '#aea9e4', '&:hover': { backgroundColor: '#2f2b43' } }}>Bank</MenuItem>
            <MenuItem value="Cash" sx={{ color: '#aea9e4', '&:hover': { backgroundColor: '#2f2b43' } }}>Cash</MenuItem>
          </Select>
          <Button
            variant="contained"
            color="primary"
            onClick={addSingleWallet}
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
            Add Wallet
          </Button>
        </Box>
      </AppModal>
      <AppModal
        open={isOpenTransaction}
        onOpen={handleOpenTransaction}
        onClose={handleCloseTransaction}
        onSubmit={addSingleTransaction}
        headerContent="Add Transaction"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <FormControl error={error} variant="standard" sx={{ color: '#aea9e4' }} >
            <FormLabel id="demo-error-radios"
              sx={{
                color: '#AD49E1', fontWeight: '600',
                '&.MuiFormLabel-root': {
                  color: '#AD49E1'
                }
              }}>
              Choose type of transaction.
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-error-radios"
              name="quiz"
              value={value}
              sx={{
                display: 'flex', flexDirection: 'row', justifyContent: 'space-beetween',
              }}
              onChange={handleRadioChange}
            >
              {
                transactionTypes.map((eachType: string) =>
                  <FormControlLabel value={eachType}
                    control={<Radio
                      sx={{
                        color: '#AD49E1',
                        '&.Mui-checked': { color: '#AD49E1' },
                        '&.Mui-focused': { color: '#AD49E1' },
                      }} />}
                    label={eachType} />
                )
              }
            </RadioGroup>
          </FormControl>
          <TextField
            margin="normal"
            required
            fullWidth
            placeholder='Transaction Name'
            value={transactionName}
            onChange={(e) => setTransactionName(e.target.value)}
            sx={inputStyle}
          />

          <Select
            labelId="demo-simple-select-label"
            required
            id="demo-simple-select"
            label="Period"
            value={category || ''}
            onChange={handleChangeCategory}
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
              Category
            </MenuItem>
            {
              value == "Income" ?
                <MenuItem
                  value="Income"
                  sx={{ color: '#aea9e4', '&:hover': { backgroundColor: '#2f2b43' } }}
                >
                  Income
                </MenuItem>
                :
                state?.user?.transactions
                  .map((transaction: Transaction) => transaction?.category) // Extract categories
                  .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index) // Remove duplicates
                  .map((uniqueCategory: string) => ( // Iterate over unique categories
                    <MenuItem
                      key={uniqueCategory}
                      value={uniqueCategory}
                      sx={{ color: '#aea9e4', '&:hover': { backgroundColor: '#2f2b43' } }}
                    >
                      {uniqueCategory}
                    </MenuItem>
                  ))
            }
          </Select>
          <Select
            labelId="demo-simple-select-label"
            required
            id="demo-simple-select"
            label="Period"
            value={walletTransactionId || ''}
            onChange={handleChangeWalletTransactionId}
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
          {
            value == 'Save' && <Select
              labelId="demo-simple-select-label"
              required
              id="demo-simple-select"
              label="Period"
              value={goal || ''}
              onChange={handleChangeGoal}
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
                Goal
              </MenuItem>

              {state?.user?.goals?.map((goal: Goal) => (
                <MenuItem
                  key={goal?.id}
                  value={goal?.id}
                  sx={{ color: '#aea9e4', '&:hover': { backgroundColor: '#2f2b43' } }}
                >
                  {goal?.name}
                </MenuItem>
              ))}
            </Select>
          }
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={transactionDate}
              onChange={(newValue) => setTransactionDate(newValue)}
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
          <TextField
            margin="normal"
            required
            fullWidth
            placeholder='description about your transaction'
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            sx={inputStyle}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            placeholder='amount'
            value={transactionAmount || ''}
            onChange={handleTrasnactionAmount}
            sx={inputStyle}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={addSingleTransaction}
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
            Add Transaction
          </Button>
        </Box>
      </AppModal>
      < Heading location={location} />
      <Grid container spacing={4} mt={2} mb={6}>
        <Grid item xs={12} md={4} >
          {
            state.user?.wallets?.map((wallet: Wallet) => (
              <Grid fontSize='18px' mb={2} borderRadius='5px' gap={2} display='flex' justifyContent='space-between'
                bgcolor={selectedWallet == wallet.id ? '#7A1CAC' : '#1d1933'} border={selectedWallet == wallet.id ? 'none' : '2px solid #2f2b43'}
                height='100' p={2}
              >
                <Box display='flex' sx={{ cursor: 'pointer' }} gap={2} onClick={() => getEachWallet(wallet.id)}>
                  <DeleteModal
                    open={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onSubmit={() => removeEachWallet(wallet?.id)}
                  >
                    <Box>
                      Are You sure you want to delete wallet?
                    </Box>
                  </DeleteModal>
                  <Box>
                    {
                      wallet.type == 'Cash' ?
                        <WalletSharp sx={{ bgcolor: '#f4e1f9', borderRadius: '50%', p: 1, fontSize: '2.5rem', color: '#7A1CAC' }} />
                        :
                        <AccountBalance sx={{ bgcolor: '#f4e1f9', borderRadius: '50%', p: 1, fontSize: '2.5rem', color: '#7A1CAC' }} />
                    }
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" color='white' fontWeight='600'>
                      {wallet.name}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight='600' color={selectedWallet == wallet.id ? 'white' : '#a171ad'}>
                      $ {wallet.balance}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Tooltip title='Remove Item'>
                    <Delete sx={{ color: '#a171ad', cursor: 'pointer' }} onClick={handleDelete} />
                  </Tooltip>
                </Box>
              </Grid>
            ))
          }
          <Box border='2px solid #2f2b43' gap={2} display='flex' justifyContent='space-between' mb={2} borderRadius='5px' bgcolor='#1d1933' height='100' p={2}>
            <Box>
              <Typography color='white' fontWeight='600'>
                Add new wallet
              </Typography>
            </Box>
            <Box >
              <Add sx={{
                color: '#7A1CAC', border: '2px solid #7A1CAC'
                , cursor: 'pointer', fontSize: '0.9rem'
              }} onClick={handleOpenWallet} />
            </Box>
          </Box>
          <Box border='2px solid #2f2b43' gap={2} display='flex' justifyContent='space-between' mb={2} borderRadius='5px' bgcolor='#1d1933' height='100' p={2}>
            <Box>
              <Typography color='white' fontWeight='600'>
                Add new Transaction
              </Typography>
            </Box>
            <Box >
              <Add sx={{
                color: '#7A1CAC', border: '2px solid #7A1CAC'
                , cursor: 'pointer', fontSize: '0.9rem'
              }} onClick={handleOpenTransaction} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={8} spacing={3} gap={3}>
          <Box border='2px solid #2f2b43' height='70px' p={2} borderRadius='5px' bgcolor='#1d1933' color='white' mb={3}>
            <Typography fontSize='19px' fontWeight='600'>
              {singleWallet?.name}
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box border='2px solid #2f2b43' height='200px' p={2}
                borderRadius='5px' bgcolor='#1d1933' color='white' mb={3} justifyContent='center' alignItems='center' >
                <Box >
                  <Typography color='#aea9e4' fontSize={14}>
                    Total Balance
                  </Typography>
                  <Typography fontSize='25px' fontWeight={600} >
                    $ {singleWallet?.balance}
                  </Typography>
                </Box>
                <Box display='flex' justifyContent='space-between' alignContent='center' alignItems='center'>
                  <Box >
                    <Typography color='#aea9e4' fontSize={14}>
                      Personal Funds
                    </Typography>
                  </Box>
                  <Box>
                    $ {personalFunds}
                  </Box>
                </Box>
                <Divider sx={{ bgcolor: '#aea9e4', height: 2, my: 2 }} />
                <Box display='flex' justifyContent='space-between' alignContent='center' alignItems='center'>
                  <Box >
                    <Typography color='#aea9e4' fontSize={14}>
                      Credit Limits
                    </Typography>
                  </Box>
                  <Box>
                    $ {singleWallet?.creditLimit}
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} spacing={1}>
              <Box height='200px' p={2} borderRadius='5px' bgcolor='#461b4b' color='white' mb={3} >
                <Grid xs={12} p={1} display='flex' flexDirection='column' gap={4}>
                  <Box display='flex' justifyContent='space-between'>
                    <Box >
                      <Typography color='#aea9e4' fontWeight='600'>
                        Debit Card
                      </Typography>
                    </Box>
                    <Box >
                      <img
                        src='../public/images/visa.png'
                        height='25px'
                      />
                    </Box>
                  </Box>
                  <Box >
                    <Box>
                      <Typography fontSize='20px' fontWeight='600'>
                        1234 5678 7890 9875
                      </Typography>
                    </Box>
                  </Box>
                  <Box display='flex' justifyContent='space-between'>
                    <Box>Nick Jonas</Box>
                    <Box>EXP:12/21</Box>
                  </Box>
                </Grid>
              </Box>
            </Grid>
          </Grid>
          {/* chart */}
          <Box style={{ backgroundColor: '#1d1933', height: '350px' }} borderRadius='5px' my={3} border='2px solid #2f2b43'  >
            <Stack sx={{ width: '100%' }} p={2}>
              <LineChart
                xAxis={[{
                  data: balanceData?.map((point: BalanceDataPoint) => {
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
                }]}
                series={[{
                  curve: "linear",
                  data: balanceData?.map((point: BalanceDataPoint) => point?.balance),
                  label: 'remaning from wallet: ',
                  connectNulls: true, area: true, color: '#EBD3F8',

                }]}
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
          {/* table */}
          <Box border='2px solid #2f2b43' p={2}
            borderRadius='5px' bgcolor='#1d1933' color='white' mb={3} justifyContent='center' alignItems='center' >
            <Typography variant='h6' fontWeight='600'>
              Transaction History
            </Typography>
            <TableContainer sx={{ backgroundColor: '#1d1933' }} >
              <Table>
                <TableHead >
                  <TableRow >
                    <TableCell sx={{ color: 'white', fontWeight: '600' }}>Category</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: '600' }}>Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: '600' }}>Desc</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: '600' }}>Amount</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: '600' }}>Currency</TableCell>
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
                      }} >{row.category}</TableCell>
                      <TableCell sx={{
                        color: '#aea9e4',
                        borderBottom: '1px solid #aea9e42b',
                      }}>{row.date}</TableCell>
                      <TableCell sx={{
                        color: '#aea9e4',
                        borderBottom: '1px solid #aea9e42b',
                      }}>{row?.desc}</TableCell>
                      <TableCell sx={{
                        color: '#aea9e4',
                        borderBottom: '1px solid #aea9e42b',
                      }}>{row.amount}</TableCell>
                      <TableCell sx={{
                        color: '#aea9e4',
                        borderBottom: '1px solid #aea9e42b',
                      }}>{row.currency}</TableCell>
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
    '&.Mui-error fieldset': {
      borderColor: 'transparent',
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
