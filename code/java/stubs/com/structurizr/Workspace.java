// 编译桩：仅用于验证示例语法，对应真实依赖 com.structurizr:structurizr-core
package com.structurizr;

import com.structurizr.model.Model;

public class Workspace {
    private final Model model = new Model();

    public Workspace(String name, String description) {
    }

    public Model getModel() {
        return model;
    }
}
