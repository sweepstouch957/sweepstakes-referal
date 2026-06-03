'use client';

import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  LinearProgress,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  promoterService,
  PromoterUser,
  ShiftItem,
  TierInfo,
  EarningsTier,
} from '@/services/promoter.service';

// ─── helpers ──────────────────────────────────────────────────────────────────
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function usePromoterUser(): PromoterUser | null {
  try {
    const raw = Cookies.get('promoter_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ─── Tier Progress Component ───────────────────────────────────────────────────
function TierProgressBar({ tierInfo }: { tierInfo: TierInfo }) {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
        <Typography variant="caption" fontWeight={700} sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 10 }}>
          Plan de Ganancias
        </Typography>
        {tierInfo.nextLabel && (
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>
            {tierInfo.countToNext} para {tierInfo.nextLabel}
          </Typography>
        )}
      </Stack>

      {/* Tier labels */}
      <Stack direction="row" spacing={0.5} mb={1}>
        {tierInfo.tiers.map((tier) => (
          <Box
            key={tier.label}
            flex={1}
            sx={{
              py: 0.75,
              px: 0.5,
              borderRadius: 1.5,
              textAlign: 'center',
              bgcolor: tier.isCurrent ? 'rgba(255,75,155,0.2)' : 'rgba(255,255,255,0.05)',
              border: '1px solid',
              borderColor: tier.isCurrent ? 'rgba(255,75,155,0.5)' : 'transparent',
              transition: 'all 0.2s',
            }}
          >
            <Typography sx={{ fontSize: 9, color: tier.isCurrent ? '#ff4b9b' : 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {tier.label}
            </Typography>
            <Typography sx={{ fontSize: 13, color: tier.isCurrent ? '#fff' : 'rgba(255,255,255,0.4)', fontWeight: 800, lineHeight: 1.2 }}>
              {usd.format(tier.ratePerNew)}
            </Typography>
            <Typography sx={{ fontSize: 9, color: tier.isCurrent ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)' }}>
              {tier.maxCount ? `0–${tier.maxCount}` : `${tierInfo.tiers[tierInfo.tiers.length - 2]?.maxCount ?? 999}+`}
            </Typography>
          </Box>
        ))}
      </Stack>

      {/* Progress track */}
      <Box sx={{ position: 'relative', mt: 0.5 }}>
        <LinearProgress
          variant="determinate"
          value={tierInfo.progressToNext * 100}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: 'rgba(255,255,255,0.08)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              background: 'linear-gradient(90deg, #ff4b9b, #ff8ac7)',
            },
          }}
        />
        <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>
          {tierInfo.newUsersCount} nuevos registrados en este turno
        </Typography>
      </Box>
    </Box>
  );
}

// ─── Active Shift Card ────────────────────────────────────────────────────────
function ActiveShiftCard({ promoterId }: { promoterId: string }) {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['promoter-active-shift', promoterId],
    queryFn: () => promoterService.getActiveShift(promoterId),
    refetchInterval: 30_000,
  });

  if (isLoading) {
    return (
      <Box sx={cardSx}>
        <Skeleton variant="text" width="60%" height={24} sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />
        <Skeleton variant="text" width="40%" height={18} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
        <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2, mt: 2, bgcolor: 'rgba(255,255,255,0.05)' }} />
      </Box>
    );
  }

  const shift = data?.shift;
  const stats = data?.stats;
  const tierInfo = data?.tierInfo;

  if (!shift) {
    return (
      <Box sx={{ ...cardSx, textAlign: 'center', py: 4 }}>
        <WorkOutlineIcon sx={{ fontSize: 36, color: 'rgba(255,255,255,0.15)', mb: 1 }} />
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
          Sin turno activo ahora mismo
        </Typography>
      </Box>
    );
  }

  const endTime = new Date(shift.endTime);
  const timeLeft = formatDistanceToNow(endTime, { locale: es, addSuffix: true });

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Box sx={{ ...cardSx, border: '1px solid rgba(255,75,155,0.25)', background: 'linear-gradient(135deg, rgba(255,75,155,0.08) 0%, rgba(255,255,255,0.03) 100%)' }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Stack direction="row" spacing={0.75} alignItems="center" mb={0.25}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4caf50', boxShadow: '0 0 8px #4caf50' }} />
              <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 10 }}>
                Turno Activo
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <LocationOnOutlinedIcon sx={{ fontSize: 14, color: '#ff4b9b' }} />
              <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 15 }}>
                {shift.storeInfo?.name || 'Tienda'}
              </Typography>
            </Stack>
            {shift.storeInfo?.address && (
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', pl: 2.25 }}>
                {shift.storeInfo.address}
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={0.5}>
            {shift.isFirstShiftEver && (
              <Chip
                label="Primer turno"
                size="small"
                icon={<StarIcon sx={{ fontSize: '14px !important' }} />}
                sx={{ bgcolor: 'rgba(255,193,7,0.15)', color: '#ffc107', border: '1px solid rgba(255,193,7,0.3)', fontWeight: 700, fontSize: 10, height: 22 }}
              />
            )}
            {shift.isFirstShiftAtStore && !shift.isFirstShiftEver && (
              <Chip
                label="1ra vez aqui"
                size="small"
                sx={{ bgcolor: 'rgba(156,39,176,0.15)', color: '#ce93d8', border: '1px solid rgba(156,39,176,0.3)', fontWeight: 700, fontSize: 10, height: 22 }}
              />
            )}
          </Stack>
        </Stack>

        {/* Time info */}
        <Stack direction="row" spacing={3} mb={2}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <AccessTimeIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              {format(new Date(shift.startTime), 'HH:mm')} – {format(new Date(shift.endTime), 'HH:mm')}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <CalendarTodayIcon sx={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Termina {timeLeft}
            </Typography>
          </Stack>
        </Stack>

        {/* Stats mini-row */}
        <Stack direction="row" spacing={1.5} mb={2.5} sx={{ bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 2, p: 1.5 }}>
          <Box flex={1} textAlign="center">
            <Typography sx={{ color: '#ff4b9b', fontWeight: 800, fontSize: 22, lineHeight: 1 }}>
              {stats?.totalParticipations ?? shift.totalParticipations ?? 0}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, mt: 0.25 }}>Números</Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
          <Box flex={1} textAlign="center">
            <Typography sx={{ color: '#4caf50', fontWeight: 800, fontSize: 22, lineHeight: 1 }}>
              {stats?.newUsers ?? 0}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, mt: 0.25 }}>Nuevos</Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
          <Box flex={1} textAlign="center">
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 22, lineHeight: 1 }}>
              {usd.format(stats?.totalEarnings ?? shift.totalEarnings ?? 0)}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, mt: 0.25 }}>Ganado</Typography>
          </Box>
        </Stack>

        {/* Tier progress */}
        {tierInfo && <TierProgressBar tierInfo={tierInfo} />}

        {/* Refresh hint */}
        <Stack direction="row" justifyContent="flex-end" mt={1.5}>
          <Tooltip title="Actualizar">
            <IconButton size="small" onClick={() => refetch()} disabled={isFetching} sx={{ color: 'rgba(255,255,255,0.25)' }}>
              <RefreshIcon sx={{ fontSize: 14, animation: isFetching ? 'spin 1s linear infinite' : 'none', '@keyframes spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } } }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </motion.div>
  );
}

// ─── KPI Cards ────────────────────────────────────────────────────────────────
type StatPeriod = 'today' | 'week' | 'month';

function KpiSection({ promoterId }: { promoterId: string }) {
  const [period, setPeriod] = useState<StatPeriod>('today');

  const { data, isLoading } = useQuery({
    queryKey: ['promoter-stats', promoterId, period],
    queryFn: () => promoterService.getStats(promoterId, period),
  });

  const labels: Record<StatPeriod, string> = { today: 'Hoy', week: 'Semana', month: 'Mes' };

  return (
    <Box>
      <Stack direction="row" spacing={0.5} mb={1.5}>
        {(['today', 'week', 'month'] as StatPeriod[]).map((p) => (
          <Box
            key={p}
            component="button"
            onClick={() => setPeriod(p)}
            sx={{
              border: 'none',
              py: 0.5,
              px: 1.25,
              borderRadius: 1.5,
              fontFamily: 'inherit',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
              bgcolor: period === p ? '#ff4b9b' : 'rgba(255,255,255,0.07)',
              color: period === p ? '#fff' : 'rgba(255,255,255,0.4)',
            }}
          >
            {labels[p]}
          </Box>
        ))}
      </Stack>

      <Stack direction="row" spacing={1.5}>
        {[
          { label: 'Números', value: data?.stats.totalParticipations ?? 0, format: (v: number) => v.toString(), icon: <PersonOutlineIcon sx={{ fontSize: 16 }} /> },
          { label: 'Nuevos', value: data?.stats.newUsers ?? 0, format: (v: number) => v.toString(), icon: <CheckCircleOutlineIcon sx={{ fontSize: 16 }} /> },
          { label: 'Ganado', value: data?.stats.totalEarnings ?? 0, format: (v: number) => usd.format(v), icon: <TrendingUpIcon sx={{ fontSize: 16 }} /> },
        ].map((kpi) => (
          <Box key={kpi.label} flex={1} sx={{ bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 2.5, p: 1.5, border: '1px solid rgba(255,255,255,0.06)' }}>
            <Stack direction="row" spacing={0.5} alignItems="center" mb={0.5} sx={{ color: 'rgba(255,255,255,0.3)' }}>
              {kpi.icon}
              <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>{kpi.label}</Typography>
            </Stack>
            {isLoading ? (
              <Skeleton width="70%" height={28} sx={{ bgcolor: 'rgba(255,255,255,0.07)' }} />
            ) : (
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 20, lineHeight: 1 }}>
                {kpi.format(kpi.value)}
              </Typography>
            )}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

// ─── Available Shift Card ─────────────────────────────────────────────────────
function AvailableShiftItem({ shift, promoterId, onRequested }: { shift: ShiftItem; promoterId: string; onRequested: () => void }) {
  const queryClient = useQueryClient();

  const requestMutation = useMutation({
    mutationFn: () => promoterService.requestShift(shift._id, promoterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promoter-available-shifts'] });
      onRequested();
    },
  });

  return (
    <Box sx={{ bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 2, p: 1.5, border: '1px solid rgba(255,255,255,0.06)' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box flex={1} minWidth={0} pr={1}>
          <Stack direction="row" spacing={0.5} alignItems="center" mb={0.25}>
            <LocationOnOutlinedIcon sx={{ fontSize: 13, color: '#ff4b9b', flexShrink: 0 }} />
            <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 13 }} noWrap>
              {shift.storeInfo?.name || 'Tienda'}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} mt={0.25}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <CalendarTodayIcon sx={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>
                {format(new Date(shift.startTime), "EEE d MMM", { locale: es })}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <AccessTimeIcon sx={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>
                {format(new Date(shift.startTime), 'HH:mm')} – {format(new Date(shift.endTime), 'HH:mm')}
              </Typography>
            </Stack>
          </Stack>
        </Box>
        <Box
          component="button"
          onClick={() => requestMutation.mutate()}
          disabled={requestMutation.isPending}
          sx={{
            border: '1px solid rgba(255,75,155,0.4)',
            bgcolor: 'transparent',
            color: '#ff4b9b',
            borderRadius: 1.5,
            px: 1.25,
            py: 0.5,
            fontSize: 11,
            fontWeight: 700,
            fontFamily: 'inherit',
            cursor: requestMutation.isPending ? 'not-allowed' : 'pointer',
            opacity: requestMutation.isPending ? 0.6 : 1,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            '&:hover': { bgcolor: 'rgba(255,75,155,0.1)' },
          }}
        >
          {requestMutation.isPending ? <CircularProgress size={12} sx={{ color: '#ff4b9b' }} /> : 'Solicitar'}
        </Box>
      </Stack>
    </Box>
  );
}

// ─── Shift History Item ───────────────────────────────────────────────────────
function ShiftHistoryItem({ shift }: { shift: ShiftItem }) {
  const statusColor: Record<string, string> = {
    completed: '#4caf50',
    active: '#ff4b9b',
    assigned: '#2196f3',
    available: 'rgba(255,255,255,0.4)',
    requested: '#ff9800',
  };
  const statusLabel: Record<string, string> = {
    completed: 'Completado',
    active: 'Activo',
    assigned: 'Asignado',
    available: 'Disponible',
    requested: 'Solicitado',
  };

  return (
    <Box sx={{ py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.06)', '&:last-child': { borderBottom: 'none' } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>
            {shift.storeInfo?.name || 'Tienda'}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, mt: 0.25 }}>
            {format(new Date(shift.startTime), "EEE d MMM, HH:mm", { locale: es })}
          </Typography>
        </Box>
        <Box textAlign="right">
          <Typography sx={{ color: '#4caf50', fontWeight: 700, fontSize: 13 }}>
            {usd.format(shift.totalEarnings ?? 0)}
          </Typography>
          <Typography sx={{ color: statusColor[shift.status] ?? 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 600 }}>
            {statusLabel[shift.status] ?? shift.status}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const TAB_MY_SHIFTS = 0;
const TAB_AVAILABLE = 1;

export default function PromoterDashboardPage() {
  const router = useRouter();
  const user = usePromoterUser();
  const [tab, setTab] = useState(0);
  const [requestedToast, setRequestedToast] = useState(false);

  const promoterId = user?._id ?? '';

  const { data: availableData, isLoading: loadingAvailable } = useQuery({
    queryKey: ['promoter-available-shifts'],
    queryFn: () => promoterService.getAvailableShifts(1, 20),
    enabled: tab === TAB_AVAILABLE,
  });

  const { data: myShiftsData, isLoading: loadingMyShifts } = useQuery({
    queryKey: ['promoter-my-shifts', promoterId],
    queryFn: () => promoterService.getShifts(promoterId, 1, 15),
    enabled: !!promoterId && tab === TAB_MY_SHIFTS,
  });

  const { data: upcomingData } = useQuery({
    queryKey: ['promoter-upcoming', promoterId],
    queryFn: () => promoterService.getUpcomingShifts(promoterId),
    enabled: !!promoterId,
  });

  const handleLogout = () => {
    Cookies.remove('promoter_token');
    Cookies.remove('promoter_user');
    router.push('/promoter/login');
  };

  if (!user) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#0e0818', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#ff4b9b' }} />
      </Box>
    );
  }

  const upcomingShifts = upcomingData?.upcomingShifts ?? [];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0e0818', color: '#fff', pb: 6 }}>
      {/* Header */}
      <Box sx={{ background: 'linear-gradient(180deg, rgba(255,75,155,0.12) 0%, transparent 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', px: 2, py: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" maxWidth={520} mx="auto">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              src={user.profileImage}
              sx={{ width: 38, height: 38, bgcolor: '#ff4b9b', fontSize: 15, fontWeight: 700 }}
            >
              {user.firstName?.[0]}
            </Avatar>
            <Box>
              <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 15, lineHeight: 1.2 }}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                Promotora
              </Typography>
            </Box>
          </Stack>
          <IconButton size="small" onClick={handleLogout} sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#ff4b9b' } }}>
            <LogoutIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
      </Box>

      {/* Content */}
      <Box maxWidth={520} mx="auto" px={2}>
        {/* Active shift */}
        <Box mt={2.5} mb={2.5}>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>
            Turno Actual
          </Typography>
          <ActiveShiftCard promoterId={promoterId} />
        </Box>

        {/* KPIs */}
        <Box mb={2.5}>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>
            Mis Resultados
          </Typography>
          <KpiSection promoterId={promoterId} />
        </Box>

        {/* Upcoming shifts */}
        {upcomingShifts.length > 0 && (
          <Box mb={2.5}>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>
              Proximos Turnos
            </Typography>
            <Box sx={cardSx}>
              {upcomingShifts.map((shift) => (
                <Box key={shift._id} sx={{ pb: 1.5, mb: 1.5, borderBottom: '1px solid rgba(255,255,255,0.06)', '&:last-child': { pb: 0, mb: 0, borderBottom: 'none' } }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <LocationOnOutlinedIcon sx={{ fontSize: 13, color: '#ff4b9b' }} />
                        <Typography fontWeight={600} sx={{ color: '#fff', fontSize: 13 }}>
                          {shift.storeInfo?.name || 'Tienda'}
                        </Typography>
                      </Stack>
                      <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, pl: 2.25 }}>
                        {format(new Date(shift.startTime), "EEE d MMM, HH:mm", { locale: es })}
                      </Typography>
                    </Box>
                    <Chip label="Asignado" size="small" sx={{ bgcolor: 'rgba(33,150,243,0.15)', color: '#64b5f6', border: '1px solid rgba(33,150,243,0.3)', fontSize: 10, height: 20 }} />
                  </Stack>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Tabs: My shifts / Available */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            mb: 1.5,
            minHeight: 36,
            '& .MuiTabs-indicator': { bgcolor: '#ff4b9b', height: 2 },
            '& .MuiTab-root': { color: 'rgba(255,255,255,0.4)', minHeight: 36, fontSize: 12, fontWeight: 600, textTransform: 'none', '&.Mui-selected': { color: '#fff' } },
          }}
        >
          <Tab label="Mis Turnos" />
          <Tab label="Disponibles" />
        </Tabs>

        <AnimatePresence mode="wait">
          {tab === TAB_MY_SHIFTS && (
            <motion.div key="my" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Box sx={cardSx}>
                {loadingMyShifts ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} height={56} sx={{ bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 1, mb: 0.5 }} />
                  ))
                ) : (myShiftsData?.shifts ?? []).length === 0 ? (
                  <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', py: 3 }}>
                    No tienes turnos registrados
                  </Typography>
                ) : (
                  (myShiftsData?.shifts ?? []).map((shift) => (
                    <ShiftHistoryItem key={shift._id} shift={shift} />
                  ))
                )}
              </Box>
            </motion.div>
          )}

          {tab === TAB_AVAILABLE && (
            <motion.div key="avail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {requestedToast && (
                <Box sx={{ bgcolor: 'rgba(76,175,80,0.15)', border: '1px solid rgba(76,175,80,0.3)', borderRadius: 2, p: 1.5, mb: 1.5, textAlign: 'center' }}>
                  <Typography sx={{ color: '#81c784', fontSize: 13, fontWeight: 600 }}>
                    Solicitud enviada. Espera la confirmacion.
                  </Typography>
                </Box>
              )}
              <Stack spacing={1}>
                {loadingAvailable ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} height={68} sx={{ bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 2 }} />
                  ))
                ) : (availableData?.shifts ?? []).length === 0 ? (
                  <Box sx={{ ...cardSx, textAlign: 'center', py: 4 }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
                      No hay turnos disponibles ahora
                    </Typography>
                  </Box>
                ) : (
                  (availableData?.shifts ?? []).map((shift) => (
                    <AvailableShiftItem
                      key={shift._id}
                      shift={shift}
                      promoterId={promoterId}
                      onRequested={() => { setRequestedToast(true); setTimeout(() => setRequestedToast(false), 4000); }}
                    />
                  ))
                )}
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}

const cardSx = {
  bgcolor: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 2.5,
  p: 2,
};
