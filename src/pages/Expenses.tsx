
import { Box, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { Layout } from '../Layout'
import { Heading } from '../components/Heading'
import { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { MainContext } from '../context/mainContext'
import { Transaction } from '../types/types'


export const Expenses = () => {
    const location = useLocation()
    const { state, fetchItems } = useContext(MainContext)
    const [skipAnimation, setSkipAnimation] = useState(false);

    useEffect(() => {
        fetchItems('users')
    }, [])

    const filteredTransactions = state.user?.transactions?.filter((trans: Transaction) => trans?.amount < 0)

    const calculateExpenseByCategory = (transactions: Transaction[]): { label: string, value: number }[] => {
        const expenseMap = transactions
            .filter(transaction => transaction.amount < 0)
            .reduce<Record<string, number>>((acc, { category, amount }) => {
                if (category) { // Type check for safety
                    acc[category] = (acc[category] || 0) + Math.abs(amount);
                }
                return acc
            }, {})

        return Object.entries(expenseMap).map(([label, value]) => ({ label, value }))
    }

    const chartData = calculateExpenseByCategory(state?.user?.transactions)
    const totalExpenses = chartData.reduce((acc, { value }) => acc + value, 0)
    const chartDataWithPercentage = chartData.map(data => ({
        ...data,
        percentage: ((data.value / totalExpenses) * 100).toFixed(2)

    }))

    return (
        <Layout>
            < Heading location={location} />
            <Box my={1} >
                <Typography variant='h6' fontWeight={600} color='#aea9e4'>
                    Expense
                </Typography>
            </Box>
            <Grid container gap={2} >
                <Box sx={{ backgroundColor: '#1d1933', height: "500px" }} flex={4} borderRadius='5px' border='2px solid #2f2b43' px={3} >
                    <PieChart
                        height={300}
                        series={[
                            {
                                data: chartData,
                                innerRadius: 100,
                                arcLabelMinAngle: 20,
                            },
                        ]}
                        margin={{ top: 80, bottom: 80, right: 80 }}
                        slotProps={{
                            legend: {
                                direction: 'column',
                                padding: 0,
                                labelStyle: {
                                    fontSize: 14,
                                    fill: '#aea9e4',
                                },
                            },
                        }}
                        sx={{
                            [`& .${pieArcLabelClasses.root}`]: {
                                fill: 'white',
                                fontSize: 12,
                                transform: 'rotate(-90deg)',
                            },
                        }}
                        skipAnimation={skipAnimation}
                    />
                    {
                        chartDataWithPercentage.map((data, index) =>
                            <Grid item display='flex' justifyContent="space-between" >
                                <Box>
                                    <Typography variant='h6' color='#aea9e4' fontSize='16px' >
                                        {data.label}
                                    </Typography>
                                </Box>
                                <Box display='flex' color='#aea9e4'>
                                    <Typography mr={1}>
                                        {data.value.toFixed(2)}
                                    </Typography>
                                    <Typography color='white'>
                                        {data.percentage}%
                                    </Typography>
                                    <Divider sx={{ bgcolor: 'red', height: 2, my: 2 }} />
                                </Box>
                            </Grid>
                        )
                    }
                </Box>
                <Box border='2px solid #2f2b43' p={2} flex={6}
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
                                {state?.user?.transactions.map((row: Transaction) => (
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
        </Layout >
    )
}
