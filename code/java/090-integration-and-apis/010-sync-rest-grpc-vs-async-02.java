package ch090;

import io.grpc.stub.StreamObserver;

// gRPC：类型化的契约——生成客户端，二进制传输。
// 两端都归你管时，它比 REST 更快、更严格，错字段编译期就拦下。
//
// 注意：真实项目里 CouponRequest / CouponReply / CouponServiceBase
// 由 protoc 从 .proto 文件生成，这里手写示意其形状。
class SyncRestGrpcVsAsync02 {

    // proto：
    //   message CouponRequest { string code = 1; }
    //   message CouponReply { bool valid = 1; int32 discount = 2; }
    record CouponRequest(String code) {}
    record CouponReply(boolean valid, int discount) {}

    // 生成基类：proto 的 service 定义变成抽象类，业务实现继承它。
    static abstract class CouponServiceBase {
        abstract void validate(CouponRequest request,
                               StreamObserver<CouponReply> responseObserver);
    }

    static class CouponService extends CouponServiceBase {
        private final CouponStore store;

        CouponService(CouponStore store) {
            this.store = store;
        }

        @Override
        void validate(CouponRequest request, StreamObserver<CouponReply> responseObserver) {
            Coupon coupon = store.find(request.code());
            responseObserver.onNext(new CouponReply(
                coupon != null,
                coupon == null ? 0 : coupon.discountPercent()));
            responseObserver.onCompleted();
        }
    }

    interface CouponStore {
        Coupon find(String code);
    }

    record Coupon(String code, int discountPercent) {}
}
