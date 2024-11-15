import { Box, CircularProgress, createTheme, Grid, LinearProgress, Typography } from '@mui/material'
import { useContext, useEffect } from 'react'
import { Layout } from '../Layout'
import { useLocation } from 'react-router-dom'
import { Heading } from '../components/Heading'
import { MainContext } from '../context/mainContext'
import { Goal, Transaction, Wallet } from '../types/types'
import { AccountBalance, WalletSharp } from '@mui/icons-material'
import { parseISO, format } from 'date-fns';
import { BarChart } from '@mui/x-charts/BarChart';

export const Dashboard = () => {
  const location = useLocation()
  const { state, fetchItems } = useContext(MainContext)

  useEffect(() => {
    fetchItems('users')
  }, [])

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  const getEachTransaction = (id: number) => {
    const totalTransactions = state?.user?.transactions
      .reduce((sum: number, transaction: Transaction) => sum + transaction.amount, 0);

    return totalTransactions;
  };

  const calculateProgress = (wallet: Wallet) => {
    const totalTransactions = getEachTransaction(wallet.id);
    const balance = wallet.balance || 0;
    return balance > 0 ? (Math.abs(totalTransactions) / balance) * 100 : 0;
  }

  const groupTransactionsByMonth = (transactions: Transaction[]) => {
    const monthlyData: Record<string, { income: number, expenses: number }> = {}

    transactions.forEach((transaction) => {
      const date = parseISO(transaction?.date || '')
      const month = format(date, 'yyyyy-MM')
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 }
      }
      if (transaction.category == "Income") {
        monthlyData[month].income += transaction.amount
      }
      if (transaction.amount < 0) {
        monthlyData[month].expenses += Math.abs(transaction.amount)
      }
    })

    return Object.entries(monthlyData).map(([month, data]) => ({ month, ...data }))
  }

  const prepareChartData = (monthlyData: { month: string, income: number, expenses: number }[]) => {
    const labels = monthlyData.map((data) => data.month)
    const incomeData = monthlyData.map((data) => data.income)
    const expenseData = monthlyData.map((data) => data.expenses)
    return { labels, incomeData, expenseData }

  }

  const monthlyData = groupTransactionsByMonth(state?.user?.transactions || []);
  const chartData = prepareChartData(monthlyData);

  return (

    <Layout>
      < Heading location={location} />
      <Grid container gap={2} mt={2}>
        <Grid display='flex' flex={8} gap={2} flexDirection='column' border='2px solid #2f2b43' height='auto' p={2} borderRadius='5px' bgcolor='#1d1933' mb={3}>
          <Box >
            <Typography color='white' fontWeight={600}>
              Available by Wallet
            </Typography>
          </Box>
          {state?.user?.wallets.map((wallet: Wallet) =>
            <Grid container height={40} mb={1} gap={2}  >
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
        <Grid display='flex' flex={2} gap={2} flexDirection='column' border='2px solid #2f2b43' height='auto' p={2} borderRadius='5px' bgcolor='#1d1933' mb={3}>
          <Box >
            <Typography color='white' fontWeight={600}>
              Goals
            </Typography>
          </Box>
          {
            state?.user?.goals?.map((goal: Goal) => (
              <Box display='flex' sx={{ cursor: 'pointer' }} gap={2} justifyContent='space-between' >
                <Box position="relative" display="inline-flex">
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={80}
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
                    size={80}
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
                    <Typography variant="subtitle1" fontWeight='600' color='white' >
                      $ {goal?.currentAmount}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight='600' mx={1} color='white' >
                      /
                    </Typography>
                    <Typography variant="subtitle1" fontWeight='600' color='white'>
                      $ {goal?.targetAmount}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))
          }
        </Grid>
      </Grid>
      <Box style={{ backgroundColor: '#1d1933', height: '350px' }} borderRadius='5px' my={3} border='2px solid #2f2b43'  >
        <Box >
          <Typography color='white' p={2} fontWeight={600}>
            Monthly Income vs Expenses
          </Typography>
        </Box>
        <BarChart
          height={300}
          series={[
            { data: chartData.expenseData, label: 'Expense', id: 'pvId', stack: 'total' },
            { data: chartData.incomeData, label: 'Income', id: 'uvId', stack: 'total' },
          ]}
          xAxis={[{
            data: chartData.labels,
            scaleType: 'band',
            tickLabelStyle: {
              fill: 'white'
            },
            labelStyle: {
              fill: '#white'
            }
          }]}
          yAxis={[{
            tickLabelStyle: {
              fill: '#white'
            },
            labelStyle: {
              fill: '#white'
            }

          }]
          }
          slotProps={{
            legend: {
              padding: 0,
              labelStyle: {
                fontSize: 14,
                fill: '#aea9e4',
              },
            },
          }}
        />
      </Box>
    </Layout >

  )
}
