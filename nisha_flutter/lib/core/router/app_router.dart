import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/customer_login_page.dart';
import '../../features/auth/presentation/customer_register_page.dart';
import '../../features/auth/presentation/customer_recovery_page.dart';
import '../../features/auth/presentation/email_verification_pending_page.dart';
import '../../features/auth/presentation/seller_recovery_page.dart';
import '../../features/auth/presentation/verify_email_page.dart';
import '../../features/auth/presentation/seller_login_page.dart';
import '../../features/auth/presentation/seller_register_page.dart';
import '../../features/customer/presentation/customer_pages.dart';
import '../../features/messaging/presentation/conversations_page.dart';
import '../../features/public/presentation/checkout/public_checkout_page.dart';
import '../../features/public/presentation/home/public_home_page.dart';
import '../../features/public/presentation/product/public_product_detail_page.dart';
import '../../features/public/presentation/store/public_store_page.dart';
import '../../features/public/presentation/track/track_order_page.dart';
import '../../features/seller/presentation/dashboard/seller_dashboard_page.dart';
import '../../features/seller/presentation/more/seller_more_page.dart';
import '../../features/seller/presentation/onboarding/seller_onboarding_page.dart';
import '../../features/seller/presentation/orders/seller_orders_page.dart';
import '../../features/seller/presentation/products/seller_products_page.dart';
import '../../shared/extensions/build_context_x.dart';
import '../../shared/widgets/appearance_controls.dart';
import '../../shared/widgets/nisha_ui.dart';
import '../../shared/widgets/section_card.dart';
import '../../shared/widgets/workspace_shell.dart';
import '../session/app_session.dart';
import '../session/session_controller.dart';
import 'route_paths.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final session = ref.watch(sessionControllerProvider);

  return GoRouter(
    initialLocation: RoutePaths.home,
    debugLogDiagnostics: false,
    redirect: (context, state) {
      final location = state.uri.path;
      if (session is SessionLoading) {
        return null;
      }
      if (_isSellerRoute(location)) {
        if (session is SellerSession) {
          return null;
        }
        return '${RoutePaths.sellerLogin}?redirect=${Uri.encodeComponent(location)}';
      }
      if (_isCustomerRoute(location)) {
        if (session is CustomerSession) {
          return null;
        }
        return '${RoutePaths.customerLogin}?redirect=${Uri.encodeComponent(location)}';
      }
      if (_isAdminRoute(location)) {
        if (session is SellerSession && session.isAdmin) {
          return null;
        }
        if (session is SellerSession) {
          return RoutePaths.sellerDashboard;
        }
        if (session is CustomerSession) {
          return RoutePaths.customerDashboard;
        }
        return '${RoutePaths.sellerLogin}?redirect=${Uri.encodeComponent(location)}';
      }
      if (location == RoutePaths.sellerLogin && session is SellerSession) {
        return session.isAdmin
            ? RoutePaths.adminDashboard
            : RoutePaths.sellerDashboard;
      }
      if (location == RoutePaths.customerLogin && session is CustomerSession) {
        return RoutePaths.customerDashboard;
      }
      return null;
    },
    routes: [
      GoRoute(path: RoutePaths.home, builder: (_, _) => const PublicHomePage()),
      GoRoute(
        path: RoutePaths.trackOrder,
        builder: (_, _) => const TrackOrderPage(),
      ),
      GoRoute(
        path: '/store/:slug',
        builder: (context, state) => PublicStorePage(
          slug: state.pathParameters['slug'] ?? '',
        ),
      ),
      GoRoute(
        path: '/store/:slug/products/:productId',
        builder: (context, state) => PublicProductDetailPage(
          slug: state.pathParameters['slug'] ?? '',
          productId: int.tryParse(state.pathParameters['productId'] ?? '') ?? 0,
        ),
      ),
      GoRoute(
        path: '/store/:slug/checkout',
        builder: (context, state) => PublicCheckoutPage(
          slug: state.pathParameters['slug'] ?? '',
        ),
      ),
      GoRoute(
        path: RoutePaths.invoice,
        builder: (context, state) {
          final code = state.pathParameters['invoiceCode'] ?? '';
          return Scaffold(
            appBar: AppBar(title: Text(context.l10n.invoiceCode)),
            body: Center(child: SelectableText(code)),
          );
        },
      ),
      GoRoute(
        path: RoutePaths.sellerLogin,
        builder: (context, state) => SellerLoginPage(
          redirectPath: state.uri.queryParameters['redirect'],
        ),
      ),
      GoRoute(
        path: RoutePaths.sellerRegister,
        builder: (_, _) => const SellerRegisterPage(),
      ),
      GoRoute(
        path: RoutePaths.customerLogin,
        builder: (context, state) => CustomerLoginPage(
          redirectPath: state.uri.queryParameters['redirect'],
        ),
      ),
      GoRoute(
        path: RoutePaths.customerRegister,
        builder: (_, _) => const CustomerRegisterPage(),
      ),
      GoRoute(
        path: RoutePaths.customerRecover,
        builder: (_, _) => const CustomerRecoveryPage(),
      ),
      GoRoute(
        path: RoutePaths.sellerRecover,
        builder: (_, _) => const SellerRecoveryPage(),
      ),
      GoRoute(
        path: RoutePaths.verifyEmail,
        builder: (context, state) => VerifyEmailPage(
          token: state.uri.queryParameters['token'] ?? '',
          kind: state.uri.queryParameters['kind'] ?? 'customer',
        ),
      ),
      GoRoute(
        path: '${RoutePaths.verifyEmail}/pending',
        builder: (context, state) => EmailVerificationPendingPage(
          email: state.uri.queryParameters['email'] ?? '',
          kind: state.uri.queryParameters['kind'] ?? 'customer',
          loginPath: state.uri.queryParameters['kind'] == 'seller'
              ? RoutePaths.sellerLogin
              : RoutePaths.customerLogin,
        ),
      ),
      GoRoute(
        path: RoutePaths.sellerDashboard,
        builder: (context, state) => _sellerShell(context, 0, const SellerDashboardPage()),
      ),
      GoRoute(
        path: RoutePaths.sellerOrders,
        builder: (context, state) => _sellerShell(context, 1, const SellerOrdersPage()),
      ),
      GoRoute(
        path: '/seller/orders/:orderId',
        builder: (context, state) => SellerOrderDetailPage(
          orderId: int.tryParse(state.pathParameters['orderId'] ?? '') ?? 0,
        ),
      ),
      GoRoute(
        path: RoutePaths.sellerProducts,
        builder: (context, state) => _sellerShell(context, 2, const SellerProductsPage()),
      ),
      GoRoute(
        path: RoutePaths.sellerProductNew,
        builder: (_, _) => const SellerProductFormPage(),
      ),
      GoRoute(
        path: '/seller/products/:productId/edit',
        builder: (context, state) => SellerProductFormPage(
          productId: int.tryParse(state.pathParameters['productId'] ?? ''),
        ),
      ),
      GoRoute(
        path: RoutePaths.sellerConversations,
        builder: (context, state) =>
            _sellerShell(context, 3, const SellerConversationsPage()),
      ),
      GoRoute(
        path: RoutePaths.sellerMore,
        builder: (context, state) => _sellerShell(context, 4, const SellerMorePage()),
      ),
      GoRoute(
        path: RoutePaths.sellerStore,
        builder: (_, _) => const SellerStoreSettingsPage(),
      ),
      GoRoute(
        path: RoutePaths.sellerOnboarding,
        builder: (_, _) => const SellerOnboardingPage(),
      ),
      GoRoute(
        path: RoutePaths.sellerSubscription,
        builder: (_, _) => const SellerSubscriptionPage(),
      ),
      GoRoute(
        path: RoutePaths.sellerAppearance,
        builder: (context, state) => _sellerShell(
          context,
          4,
          const _AppearanceWorkspaceBody(),
        ),
      ),
      GoRoute(
        path: RoutePaths.customerDashboard,
        builder: (context, state) =>
            _customerShell(context, 0, const CustomerDashboardPage()),
      ),
      GoRoute(
        path: RoutePaths.customerOrders,
        builder: (context, state) =>
            _customerShell(context, 1, const CustomerOrdersPage()),
      ),
      GoRoute(
        path: '/customer/orders/:orderId',
        builder: (context, state) => CustomerOrderDetailPage(
          orderId: int.tryParse(state.pathParameters['orderId'] ?? '') ?? 0,
        ),
      ),
      GoRoute(
        path: RoutePaths.customerConversations,
        builder: (context, state) =>
            _customerShell(context, 2, const CustomerConversationsPage()),
      ),
      GoRoute(
        path: RoutePaths.customerAccount,
        builder: (context, state) =>
            _customerShell(context, 3, const CustomerAccountPage()),
      ),
      GoRoute(
        path: RoutePaths.customerProfile,
        builder: (_, _) => const Scaffold(body: CustomerProfilePage()),
      ),
      GoRoute(
        path: RoutePaths.customerAppearance,
        builder: (context, state) => _customerShell(
          context,
          3,
          const _AppearanceWorkspaceBody(),
        ),
      ),
      GoRoute(
        path: RoutePaths.adminDashboard,
        builder: (context, state) => _adminWebOnly(context),
      ),
      GoRoute(
        path: RoutePaths.adminStores,
        builder: (context, state) => _adminWebOnly(context),
      ),
      GoRoute(
        path: RoutePaths.adminOrders,
        builder: (context, state) => _adminWebOnly(context),
      ),
      GoRoute(
        path: RoutePaths.adminReviews,
        builder: (context, state) => _adminWebOnly(context),
      ),
      GoRoute(
        path: RoutePaths.adminChats,
        builder: (context, state) => _adminWebOnly(context),
      ),
      GoRoute(
        path: RoutePaths.adminAppearance,
        builder: (context, state) => _adminWebOnly(context),
      ),
    ],
  );
});

Widget _sellerShell(BuildContext context, int index, Widget child) {
  return WorkspaceShell(
    title: context.l10n.sellerSpace,
    currentIndex: index,
    destinations: [
      WorkspaceDestination(
        label: context.l10n.dashboard,
        icon: Icons.home_rounded,
        route: RoutePaths.sellerDashboard,
      ),
      WorkspaceDestination(
        label: context.l10n.orders,
        icon: Icons.receipt_rounded,
        route: RoutePaths.sellerOrders,
      ),
      WorkspaceDestination(
        label: context.l10n.products,
        icon: Icons.inventory_2_rounded,
        route: RoutePaths.sellerProducts,
      ),
      WorkspaceDestination(
        label: context.l10n.conversations,
        icon: Icons.forum_rounded,
        route: RoutePaths.sellerConversations,
      ),
      WorkspaceDestination(
        label: context.l10n.appearance,
        icon: Icons.more_horiz_rounded,
        route: RoutePaths.sellerMore,
      ),
    ],
    child: child,
  );
}

Widget _customerShell(BuildContext context, int index, Widget child) {
  return WorkspaceShell(
    title: context.l10n.customerSpace,
    currentIndex: index,
    destinations: [
      WorkspaceDestination(
        label: context.l10n.dashboard,
        icon: Icons.home_rounded,
        route: RoutePaths.customerDashboard,
      ),
      WorkspaceDestination(
        label: context.l10n.orders,
        icon: Icons.receipt_rounded,
        route: RoutePaths.customerOrders,
      ),
      WorkspaceDestination(
        label: context.l10n.conversations,
        icon: Icons.forum_rounded,
        route: RoutePaths.customerConversations,
      ),
      WorkspaceDestination(
        label: context.l10n.profile,
        icon: Icons.person_rounded,
        route: RoutePaths.customerAccount,
      ),
    ],
    child: child,
  );
}

Widget _adminWebOnly(BuildContext context) {
  return Scaffold(
    appBar: AppBar(title: Text(context.l10n.adminSpace)),
    body: NishaAsyncStateView(
      kind: AsyncViewKind.empty,
      title: context.l10n.adminSpace,
      subtitle: context.l10n.adminSpaceDescription,
      actionLabel: context.l10n.backToHome,
      onAction: () => context.go(RoutePaths.home),
    ),
  );
}

bool _isSellerRoute(String location) => location.startsWith('/seller');

bool _isCustomerRoute(String location) => location.startsWith('/customer');

bool _isAdminRoute(String location) => location.startsWith('/admin');

class _AppearanceWorkspaceBody extends StatelessWidget {
  const _AppearanceWorkspaceBody();

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 32),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 760),
          child: const SectionCard(
            padding: EdgeInsets.all(24),
            child: AppearanceSection(),
          ),
        ),
      ),
    );
  }
}
